
/**
 * Generates an HTML report from axe results
 * @param {string} route - The route that was tested
 * @param {Object} results - The axe results object
 * @returns {string} - HTML report
 */
function generateHtmlReport(route, results) {
    const violationsList = results.violations.map(violation => {
      const nodesList = violation.nodes.map(node => {
        return `
          <div class="node">
            <h4>Element:</h4>
            <pre>${escapeHtml(node.html)}</pre>
            <h4>Failure Summary:</h4>
            <pre>${escapeHtml(node.failureSummary)}</pre>
          </div>
        `;
      }).join('');
      
      return `
        <div class="violation">
          <h3>${violation.id}: ${violation.help}</h3>
          <p><strong>Impact:</strong> ${violation.impact}</p>
          <p><strong>Description:</strong> ${violation.description}</p>
          <p><strong>Help URL:</strong> <a href="${violation.helpUrl}" target="_blank">${violation.helpUrl}</a></p>
          <h4>Affected Elements:</h4>
          ${nodesList}
        </div>
      `;
    }).join('');
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accessibility Report for ${route}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 { color: #2c3e50; }
          h2 { color: #3498db; }
          h3 { color: #e74c3c; }
          .summary { 
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .violation {
            background-color: #fff;
            border: 1px solid #ddd;
            border-left: 5px solid #e74c3c;
            border-radius: 3px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .node {
            background-color: #f8f9fa;
            padding: 10px;
            margin: 10px 0;
            border-radius: 3px;
          }
          pre {
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
          }
          .impact-critical { border-left-color: #e74c3c; }
          .impact-serious { border-left-color: #e67e22; }
          .impact-moderate { border-left-color: #f39c12; }
          .impact-minor { border-left-color: #3498db; }
          .no-violations {
            color: #27ae60;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Accessibility Report</h1>
        <p>Report generated on ${new Date().toLocaleString()}</p>
        <h2>Page: ${route}</h2>
        
        <div class="summary">
          <h2>Summary</h2>
          <p>
            <strong>Violations:</strong> ${results.violations.length}<br>
            <strong>Passes:</strong> ${results.passes.length}<br>
            <strong>Incomplete:</strong> ${results.incomplete.length}<br>
            <strong>Inapplicable:</strong> ${results.inapplicable.length}
          </p>
        </div>
        
        <h2>Violations</h2>
        ${results.violations.length === 0 ? 
          '<p class="no-violations">No violations found! 🎉</p>' : 
          violationsList}
      </body>
      </html>
    `;
  }
  
  /**
   * Escapes HTML special characters
   * @param {string} html - String to escape
   * @returns {string} - Escaped string
   */
  function escapeHtml(html) {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  module.exports = { generateHtmlReport };