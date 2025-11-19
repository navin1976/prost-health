
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2cm),
)

#set text(
  font: "New Computer Modern",
  size: 11pt,
)

#let accent-color = rgb("#1e3a5f")
#let gray-color = rgb("#6b7280")

// Header
#grid(
  columns: (1fr, 1fr),
  align(left)[
    #text(fill: accent-color, size: 18pt, weight: "bold")[Prost Health] \
    #text(size: 10pt, fill: gray-color)[Advanced Prostate Screening]
  ],
  align(right)[
    #text(size: 10pt)[Date: #datetime.today().display()]
  ]
)

#line(length: 100%, stroke: 1pt + gray-color)

#v(1cm)

#text(size: 14pt, weight: "bold", fill: accent-color)[Screening Request & Assessment]

#v(0.5cm)

// Patient Details
#box(stroke: 1pt + gray-color, inset: 10pt, radius: 5pt, width: 100%)[
  #text(weight: "bold")[Patient Details]
  #v(0.2cm)
  #grid(
    columns: (auto, 1fr),
    gutter: 10pt,
    [*Name:*], [#data.firstName #data.lastName],
    [*DOB:*], [#data.dateOfBirth],
    [*NHS Number:*], [#if data.nhsNumber != "" [#data.nhsNumber] else [Not provided]],
    [*Email:*], [#data.email],
    [*Phone:*], [#if data.phone != "" [#data.phone] else [Not provided]],
  )
]

#v(0.5cm)

// Medical History
#text(size: 12pt, weight: "bold", fill: accent-color)[Medical History]
#v(0.2cm)
#grid(
  columns: (1fr, 1fr),
  gutter: 10pt,
  [*Previous PSA Test:*], [#if data.previousPSA == "yes" [Yes] else [No]],
  [*Previous Biopsy:*], [#if data.previousBiopsy == "yes" [Yes] else [No]],
  [*Previous MRI:*], [#if data.previousMRI == "yes" [Yes] else [No]],
)

#if data.previousPSA == "yes" [
  #v(0.2cm)
  *Last PSA Details:* \
  Date: #if data.lastPSADate != "" [#data.lastPSADate] else [Unknown] \
  Result: #if data.lastPSAResult != "" [#data.lastPSAResult ng/mL] else [Unknown]
]

#v(0.5cm)

// Risk Factors
#text(size: 12pt, weight: "bold", fill: accent-color)[Risk Factors]
#v(0.2cm)
*Family History:* #if data.familyHistory.len() > 0 [#data.familyHistory.join(", ")] else [None reported] \
*Symptoms:* #if data.symptoms.len() > 0 [#data.symptoms.join(", ")] else [None reported] \
*Ethnicity:* #if data.ethnicity != "" [#data.ethnicity] else [Not provided]

#v(0.5cm)

// MRI Safety Checklist
#text(size: 12pt, weight: "bold", fill: accent-color)[MRI Safety Checklist]
#v(0.2cm)
#box(stroke: 0.5pt + gray-color, inset: 8pt, radius: 3pt, width: 100%)[
  #grid(
    columns: (1fr, auto),
    gutter: 8pt,
    [Cardiac Pacemaker / Defibrillator:], [#if data.safetyPacemaker == "yes" [*YES*] else [No]],
    [Aneurysm Clips:], [#if data.safetyClips == "yes" [*YES*] else [No]],
    [Cochlear Implants:], [#if data.safetyImplants == "yes" [*YES*] else [No]],
    [Metal fragments in eyes:], [#if data.safetyMetal == "yes" [*YES*] else [No]],
    [Kidney Problems:], [#if data.safetyKidney == "yes" [*YES*] else [No]],
    [Claustrophobia:], [#if data.safetyClaustrophobia == "yes" [*YES*] else [No]],
  )
]
#text(size: 8pt, style: "italic")[Any "YES" answers may require further investigation before scanning.]

#v(1cm)

// Assessment
#box(fill: rgb("#f3f4f6"), inset: 15pt, radius: 5pt, width: 100%)[
  #align(center)[
    #text(size: 14pt, weight: "bold", fill: accent-color)[Risk Assessment Result] \
    #v(0.2cm)
    #text(size: 16pt, weight: "bold")[#data.riskLevel]
  ]
  #v(0.2cm)
  This assessment is based on NICE NG131 guidelines.
]

#v(1cm)

#text(size: 10pt, style: "italic")[
  Disclaimer: This document is a preliminary assessment generated based on patient-provided information. 
  It does not constitute a medical diagnosis. Please consult with a healthcare professional for clinical advice.
]
