import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import axios, { type AxiosInstance } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true // Allow any status code for testing
});

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

describe('Phase 3 Validation', () => {
  describe('File Duplication Check', () => {
    test('no duplicate files exist', () => {
      const srcFiles = getAllFiles(path.join(process.cwd(), 'src'));
      const fileNames = srcFiles.map(file => path.basename(file));
      const uniqueFileNames = new Set(fileNames);
      
      expect(fileNames.length).toBe(uniqueFileNames.size);
    });
  });

  describe('Import Path Validation', () => {
    test('all imports use absolute paths', () => {
      const srcFiles = getAllFiles(path.join(process.cwd(), 'src'))
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

      const relativeImportRegex = /from\s+['"]\.\.?\/.*?['"]/;
      const filesWithRelativeImports: string[] = [];

      srcFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        if (relativeImportRegex.test(content)) {
          filesWithRelativeImports.push(file);
        }
      });

      expect(filesWithRelativeImports).toEqual([]);
    });

    test('all imports resolve correctly', () => {
      const srcFiles = getAllFiles(path.join(process.cwd(), 'src'))
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

      const importRegex = /from\s+['"](@\/[^'"]+)['"]/g;
      const brokenImports: string[] = [];

      srcFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1].replace('@/', 'src/');
          const fullPath = path.join(process.cwd(), `${importPath}.ts`);
          const fullPathTsx = path.join(process.cwd(), `${importPath}.tsx`);
          
          if (!fs.existsSync(fullPath) && !fs.existsSync(fullPathTsx)) {
            brokenImports.push(`${file}: ${match[1]}`);
          }
        }
      });

      expect(brokenImports).toEqual([]);
    });
  });

  describe('Route Functionality', () => {
    const routes = [
      '/',
      '/dashboard',
      '/login',
      '/api/health',
      '/api/webhooks/helius'
    ];

    test.each(routes)('route %s is accessible', async (route) => {
      const response = await axiosInstance.get(route);
      
      // API routes might return different status codes
      if (route.startsWith('/api')) {
        expect(response.status).toBeLessThan(500);
      } else {
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Development Server', () => {
    test('Next.js development server is running', async () => {
      const response = await axiosInstance.get('/');
      expect(response.status).toBe(200);
    });
  });
});