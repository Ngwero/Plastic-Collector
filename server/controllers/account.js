const {
  ErrorHandler,
  MissingField,
  hashPassword,
  createToken,
  SuccessHandler,
  decodePassword,
  paginateHelper
} = require('../Helpers');
const { account: AM } = require('../models');

const register = async (req, res) => {
  if (!req.body.phoneNumber) return MissingField(res, 'Phone number');
  if (!req.body.name) return MissingField(res, 'Name');
  if (!req.body.password) return MissingField(res, 'Password');
  if (!req.body.gender) return MissingField(res, 'Gender');
  if (!req.body.district) return MissingField(res, 'District');
  try {
    const { password: pass, ...rest } = req.body;
    const password = hashPassword(pass);
    const Acc = new AM({ ...rest, password });
    await Acc.save().then((user) => {
      const token = createToken(user);
      return SuccessHandler(res, { user, token });
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const updateAccount = async (req, res) => {
  if (!Object.keys(req.body).length)
    return res.json({ success: false, result: 'Atleast one field is required to make an update, try again.' });
  if (!req.params.uid) return MissingField(res, 'Phone number');
  const { uid: _id } = req.params;
  let payload = { ...req.body };
  if (req.body.password) payload = { ...payload, password: hashPassword(req.body.password) };
  try {
    await AM.updateOne({ _id }, payload).then((resp) => {
      if (!resp.nModified < 1)
        return res.json({ success: false, result: 'Nothing was updated, everything looks the same' });

      return SuccessHandler(res, payload);
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const login = async (req, res) => {
  if (!req.body.phoneNumber) return MissingField(res, 'Phone number');
  if (!req.body.password) return MissingField(res, 'Password');

  const { phoneNumber, password } = req.body;
  try {
    const user = AM.findOne({ phoneNumber });
    if (!user) return res.json({ succes: false, result: 'No user exists with that number, try again' });
    if (!decodePassword(password, user.password))
      return res.json({ succes: false, result: 'Login credentials do not match, try again' });
    const token = createToken(user);
    return SuccessHandler(res, { user, token });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const getAccount = async (req, res) => {
  if (!req.params.uid) return MissingField(res, 'Uid');

  const { uid: _id } = req.params;
  try {
    const result = AM.findOne({ _id });
    if (!result) return res.json({ succes: false, result: 'No user exists with that id, try again' });

    return SuccessHandler(res, result);
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const getCollectorsByDistrict = async (req, res) => {
  if (!req.params.district) return MissingField(res, 'District name');
  const { page = 1, limit = 2 } = req.query;
  try {
    const total = AM.find({ district: district.trim().toLowerCase() }).countDocuments();
    AM.find({ district: district.trim().toLowerCase() }).then((result) =>
      paginateHelper(page, limit, total, result, res)
    );
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const getAllCollectors = async (req, res) => {
  const { page = 1, limit = 2 } = req.query;
  try {
    const total = AM.find().countDocuments();
    AM.find().then((result) => paginateHelper(page, limit, total, result, res));
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

module.exports = { register, login, updateAccount, getAccount, getCollectorsByDistrict, getAllCollectors };