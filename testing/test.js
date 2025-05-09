const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');
const { generateHtmlReport } = require('./utils/generateHtml');

const pages = ['/', '/dashboard', '/dashboard/statistics', '/dashboard/tree-map', '/dashboard/timeline'];
const timestamp = new Date().toISOString().replace(/:/g, '-');
const REPORTS_DIR = path.join(process.cwd(), 'reports', timestamp);


if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  

  for (const route of pages) {
    const routeName = route === '/' ? 'home' : route.substring(1);
    console.log(`🔍 Testing ${route}`);
    
    await page.goto(`http://localhost:3000${route}`);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    const reportFilename = `a11y-report-${routeName}-${timestamp}.json`;
    const reportPath = path.join(REPORTS_DIR, reportFilename);
    
    fs.writeFileSync(
      reportPath, 
      JSON.stringify(accessibilityScanResults, null, 2)
    );
    
    const htmlReportFilename = `a11y-report-${routeName}-${timestamp}.html`;
    const htmlReportPath = path.join(REPORTS_DIR, htmlReportFilename);
    
    const htmlReport = generateHtmlReport(route, accessibilityScanResults);
    fs.writeFileSync(htmlReportPath, htmlReport);
    
    console.log(`Accessibility test completed for ${route}`);
    console.log(`Violations found: ${accessibilityScanResults.violations.length}`);
    console.log(`Full report saved to: ${reportPath}`);
    console.log(`HTML report saved to: ${htmlReportPath}`);
    
    if (accessibilityScanResults.violations.length > 0) {
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`- ${violation.id}: ${violation.help} (${violation.impact} impact)`);
      });
    }
  }

  await browser.close();
})().catch(error => {
  console.error('Error running accessibility tests:', error);
  process.exit(1);
});
