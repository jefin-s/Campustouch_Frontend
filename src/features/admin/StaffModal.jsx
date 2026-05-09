import { useMemo } from 'react';
import { X, Loader2, UserCheck } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StaffModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const isEditMode = Boolean(initialData);
  const defaultState = useMemo(() => ({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    designation: '',
  }), []);

  const initialValues = useMemo(() => {
    if (initialData) {
      return {
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        departmentId:
          initialData.departmentId ??
          initialData.departmentID ??
          initialData.department?.id ??
          '',
        designation: initialData.designation || '',
        id: initialData.id ?? initialData.staffId ?? initialData.staffID ?? '',
      };
    }

    return defaultState;
  }, [initialData, defaultState]);

  const validationSchema = useMemo(() => {
    const requiredOnCreate = (schema, message) => (isEditMode ? schema : schema.required(message));

    return Yup.object({
      firstName: requiredOnCreate(Yup.string().trim(), 'First name is required'),
      lastName: requiredOnCreate(Yup.string().trim(), 'Last name is required'),
      email: requiredOnCreate(
        Yup.string().trim().email('Enter a valid email'),
        'Email is required',
      ),
      phoneNumber: requiredOnCreate(
        Yup.string()
          .trim()
          .test('valid-phone', 'Enter a valid phone number', (value) =>
            !value || /^[0-9+\-\s()]{7,20}$/.test(value),
          ),
        'Phone number is required',
      ),
      designation: requiredOnCreate(Yup.string().trim(), 'Designation is required'),
      departmentId: requiredOnCreate(
        Yup.number()
          .transform((value, originalValue) => (originalValue === '' ? undefined : value))
          .typeError('Department ID must be a number')
          .integer('Department ID must be a whole number')
          .positive('Department ID must be greater than zero'),
        'Department ID is required',
      ),
    });
  }, [isEditMode]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (isEditMode) {
        const payload = {};

        Object.keys(values).forEach((key) => {
          if (key === 'id') return;

          const currentValue = values[key] ?? '';
          const previousValue = initialValues[key] ?? '';

          if (String(currentValue) !== String(previousValue)) {
            if (key === 'departmentId') {
              payload[key] = currentValue === '' ? null : Number(currentValue);
            } else {
              payload[key] = currentValue;
            }
          }
        });

        if (values.id) {
          payload.id = values.id;
        }

        const resolvedDepartmentId =
          values.departmentId === '' || values.departmentId === null || values.departmentId === undefined
            ? initialValues.departmentId
            : values.departmentId;

        if (
          resolvedDepartmentId !== '' &&
          resolvedDepartmentId !== null &&
          resolvedDepartmentId !== undefined
        ) {
          payload.departmentId = Number(resolvedDepartmentId);
        }

        onSubmit(payload, values.id);
        return;
      }

      onSubmit(
        {
          ...values,
          departmentId: Number(values.departmentId),
        },
        values.id,
      );
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card student-modal">
        <div className="modal-header">
          <h2>{initialData ? 'Update Staff' : 'Add New Staff'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={formik.handleSubmit} className="modal-form">
          <div className="form-content">
            <div className="image-upload-section">
              <div className="image-preview-container">
                <div className="image-placeholder">
                  <UserCheck size={32} />
                </div>
              </div>
              <p className="upload-hint">Staff Information</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter first name" className={formik.touched.firstName && formik.errors.firstName ? 'input-error' : ''} />
                {formik.touched.firstName && formik.errors.firstName ? <p className="form-error">{formik.errors.firstName}</p> : null}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter last name" className={formik.touched.lastName && formik.errors.lastName ? 'input-error' : ''} />
                {formik.touched.lastName && formik.errors.lastName ? <p className="form-error">{formik.errors.lastName}</p> : null}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="staff@campus.com" className={formik.touched.email && formik.errors.email ? 'input-error' : ''} />
                {formik.touched.email && formik.errors.email ? <p className="form-error">{formik.errors.email}</p> : null}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="text" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter phone number" className={formik.touched.phoneNumber && formik.errors.phoneNumber ? 'input-error' : ''} />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? <p className="form-error">{formik.errors.phoneNumber}</p> : null}
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input type="text" name="designation" value={formik.values.designation} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. Professor, Lecturer" className={formik.touched.designation && formik.errors.designation ? 'input-error' : ''} />
                {formik.touched.designation && formik.errors.designation ? <p className="form-error">{formik.errors.designation}</p> : null}
              </div>
              <div className="form-group">
                <label>Department ID</label>
                <input type="number" name="departmentId" value={formik.values.departmentId} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter dept ID" className={formik.touched.departmentId && formik.errors.departmentId ? 'input-error' : ''} />
                {formik.touched.departmentId && formik.errors.departmentId ? <p className="form-error">{formik.errors.departmentId}</p> : null}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Update Staff' : 'Save Staff')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
