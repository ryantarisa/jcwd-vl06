import puppeteer from "puppeteer";

export const createPdf = async (html) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle2",
      networkIdleTimeout: 5000,
    });
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    return pdf;
  } catch (error) {
    console.log(error);
    return false;
  }
};
