export type ParsedReceipt = {
    merchant: string;
    amount: string;
    date: string;
  };
  
  export async function extractReceiptText(imageUri: string) {
    const apiKey = process.env.EXPO_PUBLIC_OCR_SPACE_API_KEY;
  
    if (!apiKey) {
      throw new Error("OCR API key is missing.");
    }
  
    const formData = new FormData();
  
    formData.append("file", {
      uri: imageUri,
      name: "receipt.jpg",
      type: "image/jpeg",
    } as any);
  
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
  
    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: apiKey,
      },
      body: formData,
    });
  
    const result = await response.json();
  
    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage?.[0] || "OCR failed.");
    }
  
    return result.ParsedResults?.[0]?.ParsedText || "";
  }
  
  export function parseReceiptText(text: string): ParsedReceipt {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  
    const ignoreWords = ["visa", "mastercard", "change", "cash", "subtotal", "tax"];
  
    const merchant =
      lines.find((line) => {
        const lower = line.toLowerCase();
        return (
          line.length > 2 &&
          !lower.includes("total") &&
          !ignoreWords.some((word) => lower.includes(word)) &&
          !/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(line)
        );
      }) || "Receipt Transaction";
  
    const amountRegex =
      /(?:total|amount|balance|sale)\D{0,20}(\$?\d{1,4}(?:,\d{3})*\.\d{2})/gi;
  
    const labeledAmounts = [...text.matchAll(amountRegex)].map((match) =>
      match[1].replace("$", "").replace(",", "")
    );
  
    const allAmounts = [...text.matchAll(/\$?\d{1,4}(?:,\d{3})*\.\d{2}/g)].map(
      (match) => match[0].replace("$", "").replace(",", "")
    );
  
    const amount =
      labeledAmounts.length > 0
        ? labeledAmounts[labeledAmounts.length - 1]
        : allAmounts.length > 0
          ? allAmounts[allAmounts.length - 1]
          : "";
  
    const dateMatch = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/);
  
    return {
      merchant,
      amount,
      date: dateMatch ? dateMatch[0] : "",
    };
  }