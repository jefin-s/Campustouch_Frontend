import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const GenericModal = ({ isOpen, onClose, onSubmit, isLoading, initialData, title, fields }) => {
  const isEditMode = Boolean(initialData);
  const initialValues = useMemo(() => {
    if (initialData) {
      return { ...initialData };
    }

    const defaultData = {};
    fields.forEach((field) => {
      defaultData[field.name] = '';
    });

    return defaultData;
  }, [initialData, fields]);

  const validationSchema = useMemo(() => {
    const schemaMap = {};

    fields.forEach((field) => {
      let schema;

      if (field.type === 'number') {
        schema = Yup.number()
          .transform((value, originalValue) => (originalValue === '' ? undefined : value))
          .typeError(`${field.label} must be a valid number`)
          .integer(`${field.label} must be a whole number`);
      } else if (field.type === 'email') {
        schema = Yup.string().trim().email('Enter a valid email address');
      } else {
        schema = Yup.string().trim();
      }

      if (field.required && !isEditMode) {
        schema = schema.required(`${field.label} is required`);
      }

      schemaMap[field.name] = schema;
    });

    return Yup.object(schemaMap);
  }, [fields, isEditMode]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (isEditMode) {
        const payload = {};

        fields.forEach((field) => {
          const currentValue = values[field.name] ?? '';
          const previousValue = initialValues[field.name] ?? '';

          if (String(currentValue) !== String(previousValue)) {
            if (field.type === 'number') {
              payload[field.name] = currentValue === '' ? null : Number(currentValue);
            } else {
              payload[field.name] = currentValue;
            }
          }
        });

        if (values.id) {
          payload.id = values.id;
        }

        onSubmit(payload, values.id);
        return;
      }

      const payload = { ...values };
      fields.forEach((field) => {
        if (field.type === 'number' && payload[field.name] !== '') {
          payload[field.name] = Number(payload[field.name]);
        }
      });
      onSubmit(payload, payload.id);
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[560px] bg-white rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden border border-[#e0e0e0]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]/40 hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all z-10"
              onClick={onClose}
            >
              <X size={17} />
            </button>

            <div className="px-8 pt-8 pb-6">
              <div className="mb-8">
                <h2 className="text-[24px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] mb-1">
                  {initialData ? `Update ${title}` : `New ${title}`}
                </h2>
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50">Please provide the details below to continue.</p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {fields.map((field) => (
                  <div className="space-y-1.5" key={field.name}>
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      {field.label}
                      {field.required && <span className="text-[#0066cc] ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formik.values[field.name] || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={`w-full bg-[#f5f5f7] border ${formik.touched[field.name] && formik.errors[field.name] ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30 min-h-[100px] resize-none`}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={formik.values[field.name] || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full bg-[#f5f5f7] border ${formik.touched[field.name] && formik.errors[field.name] ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer`}
                      >
                        <option value="">Select an option</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formik.values[field.name] || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        className={`w-full bg-[#f5f5f7] border ${formik.touched[field.name] && formik.errors[field.name] ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                      />
                    )}

                    {formik.touched[field.name] && formik.errors[field.name] && (
                      <motion.p
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#ff3b30] text-[11px] font-medium"
                      >
                        {formik.errors[field.name]}
                      </motion.p>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 bg-[#f5f5f7] text-[#1d1d1f]/50 py-3 rounded-full text-[13px] font-['SF Pro Text'] font-semibold hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-[#0066cc] hover:bg-[#0071e3] text-white py-3 rounded-full text-[13px] font-['SF Pro Text'] font-semibold transition-all flex items-center justify-center gap-2 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={17} /> : (
                      <>
                        {initialData ? 'Update Record' : 'Create Record'}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GenericModal;
