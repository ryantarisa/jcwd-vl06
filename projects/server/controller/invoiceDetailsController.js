import InvoiceDetail from "../models/InvoiceDetailModel.js";

export const addInvoiceDetail = async (req, res) => {
  const { invoice_id, product_id, price, qty } = req.body;

  try {
    const response = await InvoiceDetail.create({
      invoice_id,
      product_id,
      price,
      qty,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
