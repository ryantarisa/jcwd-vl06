import Payment from "../models/PaymentModel.js";
import { uploader } from "../helper/uploader.js";
import InvoiceHeader from "../models/InvoiceHeaderModel.js";

export const addPayment = async (req, res) => {
  try {
    let path = "/payments";
    const upload = uploader(path, "Payment").single("image");
    console.log("req.body");

    upload(req, res, async () => {
      const { invoice_id, bank, account_name, amount } = req.body;
      const response = await Payment.create({
        invoice_id,
        bank,
        account_name,
        amount,
        image: req.file.filename,
      });
      res
        .status(200)
        .json({ msg: "Payment confirmation submitted ", response });
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const response = await Payment.findAll({
      attributes: ["invoice_id"],
      // where: {
      //   invoice_id: req.params.id,
      // },
    });
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
