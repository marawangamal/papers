import React, { ReactNode } from "react";
import { Stack, Box } from "@mantine/core";

/**
 * Props for the TimelineSection component
 */
interface TimelineSectionProps<T> {
  /** Unique identifier for this section */
  id: string;
  /** Header content for this section */
  header: ReactNode;
  /** Items to display in this section */
  items: T[];
  /** Function to render each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Whether this header should be sticky when scrolling */
  stickyHeader?: boolean;
  /** Additional styles for the section */
  sectionStyle?: React.CSSProperties;
  /** Additional styles for the items container */
  itemsContainerStyle?: React.CSSProperties;
}

/**
 * Props for the Timeline component
 */
interface TimelineProps<T> {
  /** Data organized into sections */
  sections: {
    id: string;
    header: ReactNode;
    items: T[];
  }[];
  /** Function to render each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Whether section headers should be sticky when scrolling */
  stickyHeaders?: boolean;
  /** Style for the timeline line */
  lineStyle?: React.CSSProperties;
  /** Additional styles for the container */
  containerStyle?: React.CSSProperties;
  /** Additional styles for each section */
  sectionStyle?: React.CSSProperties;
  /** Additional styles for the items container */
  itemsContainerStyle?: React.CSSProperties;
  /** Spacing between items */
  itemSpacing?: number | string;
  /** Spacing between sections */
  sectionSpacing?: number | string;
}

/**
 * A single section in the timeline
 */
function TimelineSection<T>({
  id,
  header,
  items,
  renderItem,
  stickyHeader = false,
  sectionStyle,
  itemsContainerStyle,
}: TimelineSectionProps<T>) {
  return (
    <Stack key={id} gap="lg" style={sectionStyle}>
      {/* Section header */}
      <Box
        style={{
          position: stickyHeader ? "sticky" : "relative",
          top: stickyHeader ? 0 : "auto",
          backgroundColor: "white",
          zIndex: stickyHeader ? 10 : 1,
          paddingBottom: "8px",
          ...sectionStyle,
        }}
      >
        {header}
      </Box>

      {/* Section items */}
      <Stack
        gap="md"
        style={{
          position: "relative",
          paddingLeft: "24px",
          ...itemsContainerStyle,
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
}

/**
 * Generic Timeline component that can display any content in a timeline format
 */
export default function Timeline<T>({
  sections,
  renderItem,
  stickyHeaders = true,
  lineStyle,
  containerStyle,
  sectionStyle,
  itemsContainerStyle,
  sectionSpacing = "xl",
}: TimelineProps<T>) {
  return (
    <Stack
      gap={sectionSpacing}
      style={{
        position: "relative",
        ...containerStyle,
      }}
    >
      {/* Main timeline line */}
      <Box
        style={{
          position: "absolute",
          left: "8px",
          top: "20px", // Adjust to align with the first header
          bottom: "20px",
          width: "1px",
          backgroundColor: "#DEE2E6",
          zIndex: 1,
          ...lineStyle,
        }}
      />

      {sections.map((section) => (
        <TimelineSection
          key={section.id}
          id={section.id}
          header={section.header}
          items={section.items}
          renderItem={renderItem}
          stickyHeader={stickyHeaders}
          sectionStyle={sectionStyle}
          itemsContainerStyle={itemsContainerStyle}
        />
      ))}
    </Stack>
  );
}

/**
 * Example usage of the Timeline component
 */
/*
// Example usage with the papers data:
function Example() {
  const collectionPapers = React.use(getCollectionPapers());
  const collectionPapersIds = new Set(
    collectionPapers.map((paper) => paper.id as string)
  );
  
  // Process the data into sections
  const sections = groupByMonthYear(collectionPapers).map(({ monthYear, papers, friendlyDate }) => ({
    id: monthYear,
    header: (
      <Group gap="xs" align="center">
        <IconCalendar size={16} />
        <Code>{friendlyDate}</Code>
      </Group>
    ),
    items: papers,
  }));

  // Render the timeline
  return (
    <Timeline
      sections={sections}
      renderItem={(paper) => (
        <ResearchPaper
          mode="collapsed"
          paper={paper}
          collectionPapersIds={collectionPapersIds}
        />
      )}
      stickyHeaders={true}
      lineStyle={{
        backgroundColor: "#DEE2E6",
      }}
    />
  );
}
*/
