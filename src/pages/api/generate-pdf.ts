import type { APIRoute } from 'astro';
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import { readFile } from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Read the template
    const templatePath = path.join(process.cwd(), 'src/templates/screening-request.typ');
    const template = await readFile(templatePath, 'utf8');

    // Create a compiler instance
    const compiler = NodeCompiler.create();

    // Helper to format arrays for Typst
    const formatArray = (arr: any[]) => {
      if (!arr || arr.length === 0) return '()';
      // Escape quotes in strings
      const items = arr.map((item) => `"${String(item).replace(/"/g, '\\"')}"`);
      return `(${items.join(', ')})`;
    };

    // Helper to safely handle strings
    const safeStr = (str: any) => (str ? `"${String(str).replace(/"/g, '\\"')}"` : '""');

    // Prepare data for Typst
    const typstContent = `
#let data = (
  firstName: ${safeStr(data.firstName)},
  lastName: ${safeStr(data.lastName)},
  dateOfBirth: ${safeStr(data.dateOfBirth)},
  email: ${safeStr(data.email)},
  phone: ${safeStr(data.phone)},
  nhsNumber: ${safeStr(data.nhsNumber)},
  
  previousPSA: ${safeStr(data.previousPSA)},
  lastPSADate: ${safeStr(data.lastPSADate)},
  lastPSAResult: ${safeStr(data.lastPSAResult)},
  previousBiopsy: ${safeStr(data.previousBiopsy)},
  previousMRI: ${safeStr(data.previousMRI)},
  
  familyHistory: ${formatArray(data.familyHistory)},
  symptoms: ${formatArray(data.symptoms)},
  ethnicity: ${safeStr(data.ethnicity)},
  riskLevel: ${safeStr(data.riskLevel)},
  
  safetyPacemaker: ${safeStr(data.safetyPacemaker)},
  safetyClips: ${safeStr(data.safetyClips)},
  safetyImplants: ${safeStr(data.safetyImplants)},
  safetyMetal: ${safeStr(data.safetyMetal)},
  safetyKidney: ${safeStr(data.safetyKidney)},
  safetyClaustrophobia: ${safeStr(data.safetyClaustrophobia)}
)

${template}
    `;

    // Compile to PDF
    const artifact = compiler.compile({
      mainFileContent: typstContent,
    });

    // Return the PDF as a blob
    const pdfBuffer = (artifact as any).result || artifact;

    return new Response(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="screening-request.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
