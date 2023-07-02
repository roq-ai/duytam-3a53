import * as yup from 'yup';

export const cryptocurrencyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  gas_fee: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
