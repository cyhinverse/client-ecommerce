/**
 * Property Test: Type Centralization
 * Validates: Requirements 3.4
 * 
 * Scans component files to ensure no reusable type definitions exist outside src/types/
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Patterns that indicate reusable types that should be in types folder
const REUSABLE_TYPE_PATTERNS = [
  // Common entity types that should be centralized
  /^(?:export\s+)?interface\s+(User|Shop|Product|Order|Cart|Category|Voucher|Banner|Notification|Review)\s*\{/gm,
  /^(?:export\s+)?type\s+(User|Shop|Product|Order|Cart|Category|Voucher|Banner|Notification|Review)\s*=/gm,
  // Data types that are used across multiple components
  /^(?:export\s+)?interface\s+\w*(Data|Payload|Response|State)\s*\{/gm,
];

// Patterns that are acceptable inline types (component-specific)
const ACCEPTABLE_INLINE_PATTERNS = [
  /Props\s*\{/,           // Component props
  /Props\s*=/,            // Component props type alias
  /^interface\s+\w+Props/, // Named props interfaces
  /FormData\s*\{/,        // Local form data
  /LocalState\s*\{/,      // Local state types
];

function isAcceptableInlineType(line: string): boolean {
  return ACCEPTABLE_INLINE_PATTERNS.some(pattern => pattern.test(line));
}

function findReusableTypesInFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const issues: string[] = [];

  for (const pattern of REUSABLE_TYPE_PATTERNS) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const line = match[0];
      if (!isAcceptableInlineType(line)) {
        issues.push(`${filePath}: Found potentially reusable type: ${line.trim()}`);
      }
    }
  }

  return issues;
}

function getAllComponentFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and test directories
      if (entry.name !== "node_modules" && !entry.name.startsWith("__")) {
        files.push(...getAllComponentFiles(fullPath));
      }
    } else if (entry.isFile() && /\.(tsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

describe("Property: Type Centralization", () => {
  const componentsDir = path.resolve(__dirname, "../../components");
  const appDir = path.resolve(__dirname, "../../app");
  const featuresDir = path.resolve(__dirname, "../../features");

  it("should not have reusable entity types in components folder", () => {
    const componentFiles = getAllComponentFiles(componentsDir);
    const allIssues: string[] = [];

    for (const file of componentFiles) {
      const issues = findReusableTypesInFile(file);
      allIssues.push(...issues);
    }

    // Filter out known acceptable cases
    const filteredIssues = allIssues.filter(issue => {
      // Allow CreateVariant/UpdateVariant in product forms (they extend base types)
      if (issue.includes("CreateVariant") || issue.includes("UpdateVariant")) {
        return false;
      }
      // Allow AdminShopView which extends Shop
      if (issue.includes("AdminShopView")) {
        return false;
      }
      return true;
    });

    if (filteredIssues.length > 0) {
      console.log("Found reusable types outside types folder:");
      filteredIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    expect(filteredIssues.length).toBe(0);
  });

  it("should not have reusable entity types in app folder", () => {
    const appFiles = getAllComponentFiles(appDir);
    const allIssues: string[] = [];

    for (const file of appFiles) {
      const issues = findReusableTypesInFile(file);
      allIssues.push(...issues);
    }

    // Filter out known acceptable cases
    const filteredIssues = allIssues.filter(issue => {
      // Allow extended types that build on base types
      if (issue.includes("AdminShopListItem")) return false;
      return true;
    });

    if (filteredIssues.length > 0) {
      console.log("Found reusable types in app folder:");
      filteredIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    expect(filteredIssues.length).toBe(0);
  });

  it("should have all entity types in types folder", () => {
    const typesDir = path.resolve(__dirname, "../../types");
    const expectedTypeFiles = [
      "user.ts",
      "shop.ts",
      "product.ts",
      "order.ts",
      "cart.ts",
      "category.ts",
      "voucher.ts",
      "banner.ts",
      "notification.ts",
      "chat.ts",
    ];

    for (const typeFile of expectedTypeFiles) {
      const filePath = path.join(typesDir, typeFile);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });
});
