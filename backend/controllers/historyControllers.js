import Analysis from "../models/Analysis.js";

export const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Error fetching history" });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const item = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) {
      return res.status(404).json({ message: "Record not found" });
    }
    await Analysis.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting record" });
  }
};
