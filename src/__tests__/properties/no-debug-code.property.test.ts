/**
 * Property-Based Tests for No Debug Code in Production
 * 
 * Feature: code-cleanup-audit
 * Property 8: No Debug Code in Production
 * 
 * For any TypeScript/JavaScript file in the src directory, there SHALL be
 * no console.log statements except those wrapped in a conditional logger
 * utility that can be disabled in production.
 * 
 * **Validates: Requirements 8.2, 10.1, 10.2, 10.3, 10.4, 10.5**
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Helper function to recursively get all TypeScript/JavaScript files
function getAllSourceFiles(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules, .next, and test directories
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === "__tests__" ||
        entry.name === "tests"
      ) {
        continue;
      }
      getAllSourceFiles(fullPath, files);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") ||
        entry.name.endsWith(".tsx") ||
        entry.name.endsWith(".js") ||
        entry.name.endsWith(".jsx")) &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".test.tsx") &&
      !entry.name.endsWith(".spec.ts") &&
      !entry.name.endsWith(".spec.tsx")
    ) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Helper function to find console.log statements in a file
function findConsoleLogStatements(filePath: string): { line: number; content: string }[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const matches: { line: number; content: string }[] = [];
  
  // Regex to match console.log statements
  // Excludes comments and strings containing console.log
  const consoleLogRegex = /(?<!\/\/.*?)(?<!\/\*.*?)console\.log\s*\(/;
  
  lines.forEach((line, index) => {
    // Skip lines that are comments
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("//") || trimmedLine.startsWith("*")) {
      return;
    }
    
    if (consoleLogRegex.test(line)) {
      matches.push({
        line: index + 1,
        content: trimmedLine,
      });
    }
  });
  
  return matches;
}

describe("Feature: code-cleanup-audit, Property 8: No Debug Code in Production", () => {
  const srcDir = path.resolve(__dirname, "../../../");
  
  describe("console.log statements", () => {
    /**
     * Property: No console.log statements in production source files
     */
    it("should have no console.log statements in src directory", () => {
      const sourceFiles = getAllSourceFiles(srcDir);
      const filesWithConsoleLogs: { file: string; matches: { line: number; content: string }[] }[] = [];
      
      sourceFiles.forEach((file) => {
        const matches = findConsoleLogStatements(file);
        if (matches.length > 0) {
          filesWithConsoleLogs.push({
            file: path.relative(srcDir, file),
            matches,
          });
        }
      });
      
      if (filesWithConsoleLogs.length > 0) {
        const errorMessage = filesWithConsoleLogs
          .map(
            ({ file, matches }) =>
              `${file}:\n${matches.map((m) => `  Line ${m.line}: ${m.content}`).join("\n")}`
          )
          .join("\n\n");
        
        expect.fail(
          `Found console.log statements in production code:\n\n${errorMessage}`
        );
      }
      
      expect(filesWithConsoleLogs).toHaveLength(0);
    });

    /**
     * Property: Specific files that previously had console.log should be clean
     */
    it("should have no console.log in productAction.ts", () => {
      const filePath = path.join(srcDir, "features/product/productAction.ts");
      if (fs.existsSync(filePath)) {
        const matches = findConsoleLogStatements(filePath);
        expect(matches).toHaveLength(0);
      }
    });

    it("should have no console.log in productSlice.ts", () => {
      const filePath = path.join(srcDir, "features/product/productSlice.ts");
      if (fs.existsSync(filePath)) {
        const matches = findConsoleLogStatements(filePath);
        expect(matches).toHaveLength(0);
      }
    });

    it("should have no console.log in cartAction.ts", () => {
      const filePath = path.join(srcDir, "features/cart/cartAction.ts");
      if (fs.existsSync(filePath)) {
        const matches = findConsoleLogStatements(filePath);
        expect(matches).toHaveLength(0);
      }
    });

    it("should have no console.log in authAction.ts", () => {
      const filePath = path.join(srcDir, "features/auth/authAction.ts");
      if (fs.existsSync(filePath)) {
        const matches = findConsoleLogStatements(filePath);
        expect(matches).toHaveLength(0);
      }
    });
  });

  describe("other debug statements", () => {
    /**
     * Property: No debugger statements in production code
     */
    it("should have no debugger statements in src directory", () => {
      const sourceFiles = getAllSourceFiles(srcDir);
      const filesWithDebugger: { file: string; line: number }[] = [];
      
      sourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        const lines = content.split("\n");
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          // Skip comments
          if (trimmedLine.startsWith("//") || trimmedLine.startsWith("*")) {
            return;
          }
          
          // Check for debugger statement
          if (/\bdebugger\b/.test(line)) {
            filesWithDebugger.push({
              file: path.relative(srcDir, file),
              line: index + 1,
            });
          }
        });
      });
      
      if (filesWithDebugger.length > 0) {
        const errorMessage = filesWithDebugger
          .map(({ file, line }) => `${file}: Line ${line}`)
          .join("\n");
        
        expect.fail(
          `Found debugger statements in production code:\n\n${errorMessage}`
        );
      }
      
      expect(filesWithDebugger).toHaveLength(0);
    });

    /**
     * Property: No console.error statements that expose internal details
     * (console.error for actual error handling is acceptable)
     */
    it("should not have console.error with sensitive information", () => {
      const sourceFiles = getAllSourceFiles(srcDir);
      const suspiciousConsoleErrors: { file: string; line: number; content: string }[] = [];
      
      // Patterns that might indicate sensitive information being logged
      const sensitivePatterns = [
        /console\.error\s*\([^)]*password/i,
        /console\.error\s*\([^)]*token/i,
        /console\.error\s*\([^)]*secret/i,
        /console\.error\s*\([^)]*api[_-]?key/i,
      ];
      
      sourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        const lines = content.split("\n");
        
        lines.forEach((line, index) => {
          for (const pattern of sensitivePatterns) {
            if (pattern.test(line)) {
              suspiciousConsoleErrors.push({
                file: path.relative(srcDir, file),
                line: index + 1,
                content: line.trim(),
              });
              break;
            }
          }
        });
      });
      
      expect(suspiciousConsoleErrors).toHaveLength(0);
    });
  });

  describe("source file coverage", () => {
    /**
     * Property: All action files should be scanned
     */
    it("should scan all action files in features directory", () => {
      const featuresDir = path.join(srcDir, "features");
      if (!fs.existsSync(featuresDir)) {
        return; // Skip if features directory doesn't exist
      }
      
      const actionFiles = getAllSourceFiles(featuresDir).filter((file) =>
        file.includes("Action.ts")
      );
      
      // We should have multiple action files
      expect(actionFiles.length).toBeGreaterThan(0);
      
      // All action files should be clean
      actionFiles.forEach((file) => {
        const matches = findConsoleLogStatements(file);
        expect(matches).toHaveLength(0);
      });
    });

    /**
     * Property: All slice files should be scanned
     */
    it("should scan all slice files in features directory", () => {
      const featuresDir = path.join(srcDir, "features");
      if (!fs.existsSync(featuresDir)) {
        return; // Skip if features directory doesn't exist
      }
      
      const sliceFiles = getAllSourceFiles(featuresDir).filter((file) =>
        file.includes("Slice.ts")
      );
      
      // We should have multiple slice files
      expect(sliceFiles.length).toBeGreaterThan(0);
      
      // All slice files should be clean
      sliceFiles.forEach((file) => {
        const matches = findConsoleLogStatements(file);
        expect(matches).toHaveLength(0);
      });
    });
  });
});
