import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
} from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Class Name Merge ────────────────────────────────────────────────
/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Currency Formatting ─────────────────────────────────────────────
/**
 * Format a number as Indian Rupees (₹).
 * @example formatCurrency(1234.56) => "₹1,234.56"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Date Formatting ─────────────────────────────────────────────────
/**
 * Format a date nicely (e.g. "24 Nov 2024").
 */
export function formatDate(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "Invalid date";
  return format(parsed, "dd MMM yyyy");
}

/**
 * Format a date with time (e.g. "24 Nov 2024, 02:30 PM").
 */
export function formatDateTime(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "Invalid date";
  return format(parsed, "dd MMM yyyy, hh:mm a");
}

/**
 * Format a date as relative time (e.g. "2 hours ago").
 */
export function formatRelativeTime(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "Invalid date";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

// ─── ID / Code Generation ────────────────────────────────────────────
/**
 * Generate a unique order number.
 * @example "PGO-20241124-A3F7"
 */
export function generateOrderNumber(): string {
  const datePart = format(new Date(), "yyyyMMdd");
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();
  return `PGO-${datePart}-${randomPart}`;
}

/**
 * Generate a SKU from category and brand.
 * @example generateSKU("Electronics", "Samsung") => "ELC-SAM-0001"
 */
export function generateSKU(category: string, brand: string): string {
  const catCode = category.substring(0, 3).toUpperCase();
  const brandCode = brand.substring(0, 3).toUpperCase();
  const serial = Math.floor(Math.random() * 9999 + 1)
    .toString()
    .padStart(4, "0");
  return `${catCode}-${brandCode}-${serial}`;
}

// ─── Text Utilities ──────────────────────────────────────────────────
/**
 * Truncate text to a maximum length, appending "…" if truncated.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "…";
}

/**
 * Get initials from a full name (up to 2 characters).
 * @example getInitials("Deepak Mittal") => "DM"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// ─── Debounce ────────────────────────────────────────────────────────
/**
 * Returns a debounced version of the given function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ─── Status Color Helpers ────────────────────────────────────────────
/**
 * Return a Tailwind color class string based on order/entity status.
 */
export function getStatusColor(status: string): string {
  const normalised = status.toLowerCase().replace(/[\s_-]/g, "");

  const colorMap: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-100",
    processing: "text-blue-600 bg-blue-100",
    confirmed: "text-blue-600 bg-blue-100",
    shipped: "text-indigo-600 bg-indigo-100",
    delivered: "text-green-600 bg-green-100",
    completed: "text-green-600 bg-green-100",
    active: "text-green-600 bg-green-100",
    cancelled: "text-red-600 bg-red-100",
    failed: "text-red-600 bg-red-100",
    refunded: "text-orange-600 bg-orange-100",
    returned: "text-orange-600 bg-orange-100",
    inactive: "text-gray-600 bg-gray-100",
    draft: "text-gray-600 bg-gray-100",
    onhold: "text-amber-600 bg-amber-100",
  };

  return colorMap[normalised] ?? "text-gray-600 bg-gray-100";
}

/**
 * Return a Tailwind color class based on stock level vs threshold.
 *  - Green  → quantity > threshold
 *  - Orange → quantity > 0 but ≤ threshold
 *  - Red    → quantity === 0
 */
export function getStockStatusColor(
  quantity: number,
  threshold: number = 10
): string {
  if (quantity <= 0) return "text-red-600 bg-red-100";
  if (quantity <= threshold) return "text-orange-600 bg-orange-100";
  return "text-green-600 bg-green-100";
}

// ─── GST Calculation ─────────────────────────────────────────────────
/**
 * Calculate GST breakdown for a given amount.
 * @param amount   – base amount (exclusive of GST)
 * @param gstRate  – GST percentage (e.g. 18 for 18%)
 */
export function calculateGST(
  amount: number,
  gstRate: number
): {
  baseAmount: number;
  cgst: number;
  sgst: number;
  totalGST: number;
  totalAmount: number;
} {
  const totalGST = (amount * gstRate) / 100;
  const cgst = totalGST / 2;
  const sgst = totalGST / 2;
  return {
    baseAmount: amount,
    cgst: parseFloat(cgst.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    totalGST: parseFloat(totalGST.toFixed(2)),
    totalAmount: parseFloat((amount + totalGST).toFixed(2)),
  };
}

// ─── QR / Barcode ────────────────────────────────────────────────────
/**
 * Generate a unique QR token using UUID v4.
 */
export function generateQRToken(): string {
  return uuidv4();
}

/**
 * Validate common barcode formats (EAN-13, UPC-A, EAN-8, or custom alphanumeric).
 */
export function validateBarcode(barcode: string): {
  valid: boolean;
  format: string | null;
  message: string;
} {
  const trimmed = barcode.trim();

  if (/^\d{13}$/.test(trimmed)) {
    return { valid: true, format: "EAN-13", message: "Valid EAN-13 barcode" };
  }
  if (/^\d{12}$/.test(trimmed)) {
    return { valid: true, format: "UPC-A", message: "Valid UPC-A barcode" };
  }
  if (/^\d{8}$/.test(trimmed)) {
    return { valid: true, format: "EAN-8", message: "Valid EAN-8 barcode" };
  }
  if (/^[A-Za-z0-9-]{6,20}$/.test(trimmed)) {
    return {
      valid: true,
      format: "CUSTOM",
      message: "Valid custom alphanumeric barcode",
    };
  }

  return {
    valid: false,
    format: null,
    message:
      "Invalid barcode format. Expected EAN-13, UPC-A, EAN-8, or 6-20 alphanumeric characters.",
  };
}

// ─── Data Export ──────────────────────────────────────────────────────
/**
 * Download an array of objects as a CSV file.
 */
export function downloadAsCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((h) => {
      const cell = String(row[h] ?? "");
      // Escape double-quotes and wrap in quotes if needed
      const escaped = cell.replace(/"/g, '""');
      return /[,"\n]/.test(cell) ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download an array of objects as a PDF file (table layout).
 */
export function downloadAsPDF(
  data: any[],
  filename: string,
  title: string = "peNgo Report"
): void {
  if (!data.length) return;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text(title, 14, 20);

  // Subtitle / timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), "dd MMM yyyy, hh:mm a")} • peNgo Retail Command`, 14, 28);

  // Table
  let headers: string[] = [];
  let rows: string[][] = [];

  if (Array.isArray(data[0])) {
    rows = data.map((r: any[]) => r.map((c) => String(c ?? "")));
    headers = rows.length > 0 ? rows[0].map((_, i) => `Col ${i + 1}`) : [];
  } else {
    headers = Object.keys(data[0]);
    rows = data.map((row) => headers.map((h) => String(row[h] ?? "")));
  }

  autoTable(doc, {
    head: headers.length && !Array.isArray(data[0]) ? [headers] : undefined,
    body: rows,
    startY: 34,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [220, 38, 38] }, // peNgo red
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
