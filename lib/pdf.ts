import path from "node:path";
import React from "react";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { SITE } from "@/lib/site";

/*
 * The built-in Helvetica has no Cyrillic glyphs — Russian text silently
 * renders as mojibake. PT Sans is registered from assets/fonts and pulled into
 * the serverless bundle by outputFileTracingIncludes in next.config.ts.
 */
let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  const dir = path.join(process.cwd(), "assets", "fonts");
  Font.register({
    family: "PTSans",
    fonts: [
      { src: path.join(dir, "PTSans-Regular.ttf"), fontWeight: "normal" },
      { src: path.join(dir, "PTSans-Bold.ttf"), fontWeight: "bold" },
    ],
  });
  // Cyrillic has no usable hyphenation dictionary here; leave words intact.
  Font.registerHyphenationCallback((word) => [word]);
  fontsRegistered = true;
}

export interface PdfSection {
  title: string;
  content: string;
}

export interface PdfInput {
  title: string;
  userName: string;
  sections: PdfSection[];
  siteName: string;
  accentColor?: string;
}

export async function generatePDF(data: PdfInput): Promise<Buffer> {
  registerFonts();

  const accent = data.accentColor || "#C8A96E";

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#0A0A0A",
      padding: 44,
      fontFamily: "PTSans",
    },
    header: {
      fontSize: 22,
      color: accent,
      fontWeight: "bold",
      marginBottom: 6,
      textAlign: "center",
    },
    userName: {
      fontSize: 13,
      color: "#B9B4AE",
      marginBottom: 26,
      textAlign: "center",
    },
    section: {
      marginBottom: 14,
      padding: 14,
      backgroundColor: "#161616",
      borderLeftWidth: 3,
      borderLeftColor: accent,
    },
    sectionTitle: {
      fontSize: 13,
      color: accent,
      fontWeight: "bold",
      marginBottom: 6,
    },
    text: {
      fontSize: 11,
      color: "#F0EDE8",
      lineHeight: 1.6,
    },
    footer: {
      position: "absolute",
      bottom: 28,
      left: 44,
      right: 44,
      fontSize: 8,
      color: "#6E6E6E",
      textAlign: "center",
      lineHeight: 1.5,
    },
  });

  const doc = React.createElement(
    Document,
    {
      title: data.title,
      author: SITE.owner.fullName,
      subject: data.siteName,
      language: "ru-RU",
    },
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.header }, data.title),
      React.createElement(Text, { style: styles.userName }, data.userName),
      ...data.sections.map((section, index) =>
        React.createElement(
          View,
          { key: index, style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, section.title),
          React.createElement(Text, { style: styles.text }, section.content),
        ),
      ),
      React.createElement(
        Text,
        { style: styles.footer, fixed: true },
        `${data.siteName} · ${SITE.owner.fullName} · ИНН ${SITE.owner.inn} · ${SITE.owner.status}\n${SITE.owner.email} · ${SITE.owner.telegram}`,
      ),
    ),
  );

  return renderToBuffer(doc);
}
