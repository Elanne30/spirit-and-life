"use client";

import { useState } from "react";

type ReflectionSection = {
  heading: string;
  paragraphs: string[];
};

type ReflectionBodyEditorProps = {
  name?: string;
};

const emptySection = (): ReflectionSection => ({
  heading: "",
  paragraphs: [""],
});

export function ReflectionBodyEditor({
  name = "sections",
}: ReflectionBodyEditorProps) {
  const [sections, setSections] = useState<ReflectionSection[]>([
    emptySection(),
  ]);

  function updateSectionHeading(sectionIndex: number, heading: string) {
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex ? { ...section, heading } : section,
      ),
    );
  }

  function updateParagraph(
    sectionIndex: number,
    paragraphIndex: number,
    value: string,
  ) {
    setSections((current) =>
      current.map((section, index) => {
        if (index !== sectionIndex) {
          return section;
        }

        return {
          ...section,
          paragraphs: section.paragraphs.map((paragraph, index) =>
            index === paragraphIndex ? value : paragraph,
          ),
        };
      }),
    );
  }

  function addSection() {
    setSections((current) => [...current, emptySection()]);
  }

  function removeSection(sectionIndex: number) {
    setSections((current) => {
      if (current.length === 1) {
        return [emptySection()];
      }

      return current.filter((_, index) => index !== sectionIndex);
    });
  }

  function addParagraph(sectionIndex: number) {
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? { ...section, paragraphs: [...section.paragraphs, ""] }
          : section,
      ),
    );
  }

  function removeParagraph(sectionIndex: number, paragraphIndex: number) {
    setSections((current) =>
      current.map((section, index) => {
        if (index !== sectionIndex) {
          return section;
        }

        if (section.paragraphs.length === 1) {
          return { ...section, paragraphs: [""] };
        }

        return {
          ...section,
          paragraphs: section.paragraphs.filter(
            (_, paragraphIndexValue) => paragraphIndexValue !== paragraphIndex,
          ),
        };
      }),
    );
  }

  const serializedSections = JSON.stringify(sections);

  return (
    <div className="admin-stack">
      <label>Reflection body</label>

      {sections.map((section, sectionIndex) => (
        <fieldset className="admin-card" key={sectionIndex}>
          <legend>Section {sectionIndex + 1}</legend>

          <label htmlFor={`reflection-section-heading-${sectionIndex}`}>
            Heading
          </label>

          <input
            id={`reflection-section-heading-${sectionIndex}`}
            type="text"
            value={section.heading}
            onChange={(event) =>
              updateSectionHeading(sectionIndex, event.target.value)
            }
            placeholder="Section heading"
          />

          <div className="admin-stack">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <div key={paragraphIndex}>
                <label
                  htmlFor={`reflection-paragraph-${sectionIndex}-${paragraphIndex}`}
                >
                  Paragraph {paragraphIndex + 1}
                </label>

                <textarea
                  id={`reflection-paragraph-${sectionIndex}-${paragraphIndex}`}
                  rows={7}
                  value={paragraph}
                  onChange={(event) =>
                    updateParagraph(
                      sectionIndex,
                      paragraphIndex,
                      event.target.value,
                    )
                  }
                  placeholder="Write this paragraph..."
                />

                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    removeParagraph(sectionIndex, paragraphIndex)
                  }
                >
                  Remove paragraph
                </button>
              </div>
            ))}
          </div>

          <button
            className="button"
            type="button"
            onClick={() => addParagraph(sectionIndex)}
          >
            + Add paragraph
          </button>

          <button
            className="button"
            type="button"
            onClick={() => removeSection(sectionIndex)}
          >
            Remove section
          </button>
        </fieldset>
      ))}

      <button className="button" type="button" onClick={addSection}>
        + Add section
      </button>

      <input type="hidden" name={name} value={serializedSections} />
    </div>
  );
}
