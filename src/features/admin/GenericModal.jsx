import { useMemo } from 'react';
import { X, Loader2 } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>{initialData ? `Update ${title}` : `Add New ${title}`}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={formik.handleSubmit} className="modal-form">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            {fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    name={field.name} 
                    value={formik.values[field.name] || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={field.placeholder}
                    className={formik.touched[field.name] && formik.errors[field.name] ? 'input-error' : ''}
                  />
                ) : field.type === 'select' ? (
                  <select 
                    name={field.name} 
                    value={formik.values[field.name] || ''} 
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched[field.name] && formik.errors[field.name] ? 'input-error' : ''}
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
                    placeholder={field.placeholder}
                    className={formik.touched[field.name] && formik.errors[field.name] ? 'input-error' : ''}
                  />
                )}
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <p className="form-error">{formik.errors[field.name]}</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericModal;
