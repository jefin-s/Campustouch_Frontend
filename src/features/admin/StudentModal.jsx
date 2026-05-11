import { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Upload, Camera, Loader2 } from 'lucide-react';
import { departmentService, programService, semesterService } from '../../services/academicServices';

const StudentModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const defaultState = useMemo(
    () => ({
      CourseId: '',
      DepartmentId: '',
      SemesterId: '',
      AdmissionDate: new Date().toISOString().split('T')[0],
      FirstName: '',
      LastName: '',
      DateOfBirth: '',
      Gender: 'Male',
      PhoneNumber: '',
      Email: '',
      Address: '',
      GuardianName: '',
      GuardianPhone: '',
      BloodGroup: '',
      AdmissionNumber: '',
      id: '',
    }),
    [],
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isEditMode = Boolean(initialData);

  const initialValues = useMemo(() => {
    if (!initialData) {
      return defaultState;
    }

    return {
      CourseId: initialData.courseId || initialData.programId || '',
      DepartmentId: initialData.departmentId || '',
      SemesterId: initialData.semesterId || '',
      AdmissionDate: initialData.admissionDate ? initialData.admissionDate.split('T')[0] : '',
      FirstName: initialData.firstName || '',
      LastName: initialData.lastName || '',
      DateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
      Gender: initialData.gender || 'Male',
      PhoneNumber: initialData.phoneNumber || '',
      Email: initialData.email || '',
      Address: initialData.address || '',
      GuardianName: initialData.guardianName || '',
      GuardianPhone: initialData.guardianPhone || '',
      BloodGroup: initialData.bloodGroup || '',
      AdmissionNumber: initialData.admissionNumber || '',
      id: initialData.id ?? initialData.studentId ?? initialData.studentID ?? '',
    };
  }, [initialData, defaultState]);

  const validationSchema = useMemo(() => {
    const phoneValidation = Yup.string()
      .trim()
      .test('valid-phone', 'Enter a valid phone number', (value) =>
        !value || /^[0-9+\-\s()]{7,20}$/.test(value),
      );

    const numberValidation = (fieldLabel) =>
      Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError(`${fieldLabel} must be a valid number`)
        .integer(`${fieldLabel} must be a whole number`)
        .positive(`${fieldLabel} must be greater than zero`);

    const applyRequiredForCreate = (schema, message) =>
      isEditMode ? schema : schema.required(message);

    return Yup.object({
      FirstName: applyRequiredForCreate(Yup.string().trim(), 'First name is required'),
      LastName: applyRequiredForCreate(Yup.string().trim(), 'Last name is required'),
      Email: applyRequiredForCreate(
        Yup.string().trim().email('Enter a valid email address'),
        'Email is required',
      ),
      PhoneNumber: applyRequiredForCreate(phoneValidation, 'Phone number is required'),
      CourseId: applyRequiredForCreate(numberValidation('Program'), 'Program is required'),
      DepartmentId: applyRequiredForCreate(
        numberValidation('Department'),
        'Department is required',
      ),
      SemesterId: applyRequiredForCreate(
        numberValidation('Semester'),
        'Semester is required',
      ),
      AdmissionDate: applyRequiredForCreate(
        Yup.string().trim(),
        'Admission date is required',
      ),
      DateOfBirth: applyRequiredForCreate(
        Yup.string().trim(),
        'Date of birth is required',
      ),
      Gender: Yup.string().trim().required('Gender is required'),
      GuardianName: applyRequiredForCreate(
        Yup.string().trim(),
        'Guardian name is required',
      ),
      GuardianPhone: applyRequiredForCreate(phoneValidation, 'Guardian phone is required'),
      Address: Yup.string().trim(),
      BloodGroup: Yup.string().trim(),
      AdmissionNumber: Yup.string().trim(),
    });
  }, [isEditMode]);

  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, progRes, semRes] = await Promise.all([
          departmentService.getAll(),
          programService.getAll(),
          semesterService.getAll(),
        ]);
        setDepartments(deptRes.data?.data || deptRes.data || []);
        setPrograms(progRes.data?.data || progRes.data || []);
        setSemesters(semRes.data?.data || semRes.data || []);
      } catch (error) {
        console.error('Failed to fetch modal data:', error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const data = new FormData();

      if (isEditMode) {
        Object.keys(values).forEach((key) => {
          if (key === 'id') return;

          const currentValue = values[key] ?? '';
          const previousValue = initialValues[key] ?? '';

          if (String(currentValue) !== String(previousValue)) {
            data.append(key, currentValue);
          }
        });

        if (values.id) {
          data.append('id', values.id);
        }
      } else {
        Object.keys(values).forEach((key) => {
          if (key === 'id') return;
          if (values[key] !== null && values[key] !== undefined) {
            data.append(key, values[key]);
          }
        });
      }

      if (imageFile) {
        data.append('ProfileImage', imageFile);
      }

      onSubmit(data, values.id);
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    setImageFile(null);
    if (initialData) {
      setImagePreview(initialData.profileImagePath || initialData.profileImageUrl || null);
    } else {
      setImagePreview(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card student-modal">
        <div className="modal-header">
          <h2>{initialData ? 'Update Student' : 'Add New Student'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="modal-form">
          <div className="form-content">
            <div className="image-upload-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <Camera size={32} />
                  </div>
                )}
                <label className="upload-badge">
                  <Upload size={14} />
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              </div>
              <p className="upload-hint">Upload Profile Photo</p>
            </div>

            <div className="form-grid">
              {initialData && (
                <div className="form-group">
                  <label>Admission Number</label>
                  <input
                    type="text"
                    name="AdmissionNumber"
                    value={formik.values.AdmissionNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.AdmissionNumber && formik.errors.AdmissionNumber
                        ? 'input-error'
                        : ''
                    }
                  />
                  {formik.touched.AdmissionNumber && formik.errors.AdmissionNumber ? (
                    <p className="form-error">{formik.errors.AdmissionNumber}</p>
                  ) : null}
                </div>
              )}
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="FirstName"
                  value={formik.values.FirstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter first name"
                  className={formik.touched.FirstName && formik.errors.FirstName ? 'input-error' : ''}
                />
                {formik.touched.FirstName && formik.errors.FirstName ? (
                  <p className="form-error">{formik.errors.FirstName}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="LastName"
                  value={formik.values.LastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter last name"
                  className={formik.touched.LastName && formik.errors.LastName ? 'input-error' : ''}
                />
                {formik.touched.LastName && formik.errors.LastName ? (
                  <p className="form-error">{formik.errors.LastName}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="Email"
                  value={formik.values.Email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="example@gmail.com"
                  className={formik.touched.Email && formik.errors.Email ? 'input-error' : ''}
                />
                {formik.touched.Email && formik.errors.Email ? (
                  <p className="form-error">{formik.errors.Email}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={formik.values.PhoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter phone number"
                  className={formik.touched.PhoneNumber && formik.errors.PhoneNumber ? 'input-error' : ''}
                />
                {formik.touched.PhoneNumber && formik.errors.PhoneNumber ? (
                  <p className="form-error">{formik.errors.PhoneNumber}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Program</label>
                <select
                  name="CourseId"
                  value={formik.values.CourseId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.CourseId && formik.errors.CourseId ? 'input-error' : ''}
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {formik.touched.CourseId && formik.errors.CourseId ? (
                  <p className="form-error">{formik.errors.CourseId}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  name="DepartmentId"
                  value={formik.values.DepartmentId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.DepartmentId && formik.errors.DepartmentId ? 'input-error' : ''}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {formik.touched.DepartmentId && formik.errors.DepartmentId ? (
                  <p className="form-error">{formik.errors.DepartmentId}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select
                  name="SemesterId"
                  value={formik.values.SemesterId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.SemesterId && formik.errors.SemesterId ? 'input-error' : ''}
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || `Semester ${s.number}`}
                    </option>
                  ))}
                </select>
                {formik.touched.SemesterId && formik.errors.SemesterId ? (
                  <p className="form-error">{formik.errors.SemesterId}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Admission Date</label>
                <input
                  type="date"
                  name="AdmissionDate"
                  value={formik.values.AdmissionDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.AdmissionDate && formik.errors.AdmissionDate ? 'input-error' : ''
                  }
                />
                {formik.touched.AdmissionDate && formik.errors.AdmissionDate ? (
                  <p className="form-error">{formik.errors.AdmissionDate}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="DateOfBirth"
                  value={formik.values.DateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.DateOfBirth && formik.errors.DateOfBirth ? 'input-error' : ''}
                />
                {formik.touched.DateOfBirth && formik.errors.DateOfBirth ? (
                  <p className="form-error">{formik.errors.DateOfBirth}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="Gender"
                  value={formik.values.Gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.Gender && formik.errors.Gender ? 'input-error' : ''}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formik.touched.Gender && formik.errors.Gender ? (
                  <p className="form-error">{formik.errors.Gender}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <input
                  type="text"
                  name="BloodGroup"
                  value={formik.values.BloodGroup}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. A+"
                  className={formik.touched.BloodGroup && formik.errors.BloodGroup ? 'input-error' : ''}
                />
                {formik.touched.BloodGroup && formik.errors.BloodGroup ? (
                  <p className="form-error">{formik.errors.BloodGroup}</p>
                ) : null}
              </div>
              <div className="form-group full-width">
                <label>Home Address</label>
                <textarea
                  name="Address"
                  value={formik.values.Address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter full residential address"
                  rows="2"
                  className={formik.touched.Address && formik.errors.Address ? 'input-error' : ''}
                />
                {formik.touched.Address && formik.errors.Address ? (
                  <p className="form-error">{formik.errors.Address}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="GuardianName"
                  value={formik.values.GuardianName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Full name of guardian"
                  className={formik.touched.GuardianName && formik.errors.GuardianName ? 'input-error' : ''}
                />
                {formik.touched.GuardianName && formik.errors.GuardianName ? (
                  <p className="form-error">{formik.errors.GuardianName}</p>
                ) : null}
              </div>
              <div className="form-group">
                <label>Guardian Phone</label>
                <input
                  type="text"
                  name="GuardianPhone"
                  value={formik.values.GuardianPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Contact number"
                  className={
                    formik.touched.GuardianPhone && formik.errors.GuardianPhone ? 'input-error' : ''
                  }
                />
                {formik.touched.GuardianPhone && formik.errors.GuardianPhone ? (
                  <p className="form-error">{formik.errors.GuardianPhone}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : initialData ? (
                'Update Student'
              ) : (
                'Save Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
