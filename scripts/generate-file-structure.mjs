#!/usr/bin/env node

/**
 * Generate a tree view of the `src` directory and write to `docs/0.FILE_STRUCTURE_NOW.md`.
 *
 * Notes:
 * - Normalizes formatting to a consistent tree style.
 * - Directories appear before files, both sorted alphabetically.
 * - The root `src` itself is omitted; we list its immediate children directly.
 */

import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'src');
const outputFile = path.join(projectRoot, 'docs', '0.FILE_STRUCTURE_NOW.md');

/**
 * Files to ignore in output
 */
const IGNORE_FILE_NAMES = new Set([
	'.DS_Store',
	'Thumbs.db',
]);

/**
 * Directories to ignore entirely
 */
const IGNORE_DIR_NAMES = new Set([
	'.git',
	'.idea',
	'.vscode',
]);

/**
 * Determine if a path is a directory.
 */
function isDirectory(targetPath) {
	try {
		return fs.statSync(targetPath).isDirectory();
	} catch {
		return false;
	}
}

/**
 * Get children of a directory, sorted with directories first, then files, both alphabetically.
 */
function getSortedChildren(dirPath) {
	const items = fs.readdirSync(dirPath, { withFileTypes: true });
	const directories = [];
	const files = [];
	for (const item of items) {
		if (item.name.startsWith('.')) {
			// Skip dot-files/dirs
			continue;
		}
		if (item.isDirectory()) {
			if (!IGNORE_DIR_NAMES.has(item.name)) {
				directories.push(item.name);
			}
		} else {
			if (!IGNORE_FILE_NAMES.has(item.name)) {
				files.push(item.name);
			}
		}
	}
	directories.sort((a, b) => a.localeCompare(b));
	files.sort((a, b) => a.localeCompare(b));
	// Files first, then directories to match existing doc style
	return [
		...files.map((n) => ({ name: n, isDir: false })),
		...directories.map((n) => ({ name: n, isDir: true })),
	];
}

/**
 * Build the tree lines for a directory.
 * @param {string} dirPath - absolute path of current directory
 * @param {string} prefix - prefix built from ancestor connectors
 * @param {string[]} lines - output accumulator
 */
function buildTree(dirPath, prefix, lines) {
	const children = getSortedChildren(dirPath);
	const total = children.length;
	for (let index = 0; index < total; index += 1) {
		const child = children[index];
		const isLast = index === total - 1;
		const childPath = path.join(dirPath, child.name);

		if (child.isDir) {
			const connector = isLast ? '└─' : '├─';
			lines.push(`${prefix}${connector}${child.name}`);
			const nextPrefix = prefix + (isLast ? '   ' : '│  ');
			buildTree(childPath, nextPrefix, lines);
		} else {
			// Use file-style marker that aligns visually with directory branches
			lines.push(`${prefix}│  ${child.name}`);
		}
	}
}

function ensureDirExists(targetDir) {
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}
}

function main() {
	if (!isDirectory(sourceRoot)) {
		console.error('Source directory not found:', sourceRoot);
		process.exit(1);
	}

	const lines = [];
	// List immediate children of `src` without printing the `src` root itself
	buildTree(sourceRoot, '', lines);

	// Write output file
	ensureDirExists(path.dirname(outputFile));
	const content = lines.join('\n') + '\n';
	fs.writeFileSync(outputFile, content, { encoding: 'utf8' });
	console.log(`File structure written to ${path.relative(projectRoot, outputFile)}`);
}

main();


