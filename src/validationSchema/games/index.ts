import * as yup from 'yup';

export const gameValidationSchema = yup.object().shape({
  name: yup.string().required(),
  rules: yup.string().required(),
  entry_fee: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
