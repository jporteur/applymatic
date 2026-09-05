import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { jobTitle, company, jobDescription, salary, location } = await req.json()

  if (!jobTitle || !company) {
    return NextResponse.json({ error: 'Missing job details' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const prompt = `You are an expert career coach and cover letter writer. Write a tailored cover letter and a brief fit reasoning paragraph for the following job application.

CANDIDATE PROFILE:
Name: John Utah
Title: Software Engineer (Mid-level, 5 years experience)
Skills: React, TypeScript, Node.js, PostgreSQL, REST APIs, AWS, Git, Agile
Background: 5 years building web applications at tech companies. Strong full-stack experience with a focus on clean, maintainable code and collaborative team environments. Has shipped features used by hundreds of thousands of users.

JOB DETAILS:
Title: ${jobTitle}
Company: ${company}
Location: ${location}
Salary: ${salary}
Description: ${jobDescription}

Please respond with ONLY a JSON object in this exact format, no markdown, no backticks:
{
  "reasoning": "2-3 sentence paragraph explaining why this role is a strong match for John, referencing specific skills and experience that align with the role.",
  "coverLetter": "Full professional cover letter addressed to the hiring team. 3-4 paragraphs. Sign off as John Utah."
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
    }

    const text = data.content?.[0]?.text || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', text)
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }
    const parsed = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      reasoning: parsed.reasoning,
      coverLetter: parsed.coverLetter,
    })
  } catch (err) {
    console.error('Error calling Anthropic:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
