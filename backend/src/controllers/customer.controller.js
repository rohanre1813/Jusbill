import Customer from "../models/customer.js";

export const addCustomer = async (req, res) => {
  try {
    const { name, mobile, email, address, gstin } = req.body;
    if (!name || !mobile) return res.status(400).json({ msg: "Name and Mobile Number are mandatory" });

    if (gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
      return res.status(400).json({ msg: "Invalid GSTIN format" });
    }

    const customer = await Customer.create({
      shopId: req.user.shopId,
      name, mobile, email, address, gstin
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { shopId: req.user.shopId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } }
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, address, gstin } = req.body;
    if (!name || !mobile) return res.status(400).json({ msg: "Name and Mobile Number are mandatory" });

    if (gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
      return res.status(400).json({ msg: "Invalid GSTIN format" });
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: id, shopId: req.user.shopId },
      { name, mobile, email, address, gstin },
      { new: true }
    );

    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOneAndDelete({ _id: id, shopId: req.user.shopId });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });

    res.json({ msg: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
