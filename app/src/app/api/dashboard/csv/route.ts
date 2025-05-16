

import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'papaparse';

/**
 * Fetches the data.csv file from the S3 bucket and returns it as JSON
 */
export async function GET() {
  try {
    // Initialize S3 client
    const s3Client = new S3Client({
      region: 'eu-west-2', // Assuming the bucket is in eu-west-2 region
    });

    // Set up the parameters for fetching the file
    const params = {
      Bucket: 'sdp-dev-publications',
      Key: 'data.csv',
    };

    // Fetch the file from S3
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    // Convert the stream to text
    if (!response.Body) {
        console.log(response)
      throw new Error('No data returned from S3');
    }

    const streamReader = response.Body.transformToWebStream();
    const reader = streamReader.getReader();
    
    let csvData = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      csvData += new TextDecoder().decode(value);
    }

    // Parse CSV to JSON
    const parsedData = parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    // Return the parsed data
    return NextResponse.json(parsedData.data);
  } catch (error) {
    console.error('Error fetching CSV from S3:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CSV data' },
      { status: 500 }
    );
  }
}
