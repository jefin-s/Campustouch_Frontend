import { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, 
  Search, Save, Loader2, ClipboardCheck, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { markAttendance } from '../../services/attendanceService';
import { classService, subjectService } from '../../services/academicServices';
import { getStudents } from '../../services/studentService';
import { getApiMessage } from '../../utils/apiMessage';

const AttendanceMarking = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState([]);
  // Global state to track statuses across all pages
  const [markedStatuses, setMarkedStatuses] = useState({}); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [classRes, subRes] = await Promise.all([
          classService.getAll(),
          subjectService.getAll()
        ]);
        const classesData = classRes.data.data || classRes.data || [];
        const subjectsData = subRes.data.data || subRes.data || [];
        setClasses(Array.isArray(classesData) ? classesData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (error) {
        console.error('Metadata fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleFetchStudents = async (page = 1) => {
    if (!selectedClass) return;
    setIsStudentsLoading(true);
    setCurrentPage(page);
    try {
      const response = await getStudents(page, pageSize); 
      const allStudents = response.data.data || response.data || [];
      setStudents(allStudents);
      
      // Calculate total pages logic
      if (allStudents.length === pageSize) {
        setTotalPages(prev => Math.max(prev, page + 1));
      }

      // Pre-fill statuses for NEWLY fetched students
      const newStatuses = { ...markedStatuses };
      allStudents.forEach(s => {
        if (!newStatuses[s.id]) {
          newStatuses[s.id] = 'Present';
        }
      });
      setMarkedStatuses(newStatuses);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to fetch students'));
    } finally {
      setIsStudentsLoading(false);
    }
  };

  const setStatus = (studentId, status) => {
    setMarkedStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select both class and subject');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentPayload = Object.entries(markedStatuses).map(([id, status]) => ({
        studentId: parseInt(id),
        status: status
      }));

      const payload = {
        date: new Date(attendanceDate).toISOString(),
        classId: parseInt(selectedClass),
        subjectId: parseInt(selectedSubject),
        students: studentPayload
      };
      
      const response = await markAttendance(payload);
      toast.success(getApiMessage(response, 'Attendance marked successfully!'));
      setMarkedStatuses({});
      setStudents([]);
      setSelectedClass('');
      setSelectedSubject('');
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to mark attendance.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="table-loader">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading attendance setup...</p>
      </div>
    );
  }

  const filteredStudents = students.filter(s => 
    (s.fullName || `${s.firstName} ${s.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="attendance-container">
      {/* Configuration Section */}
      <div className="mgmt-card mb-24">
        <div className="mgmt-header">
          <div className="mgmt-title-group">
            <ClipboardCheck size={24} className="text-indigo-600" />
            <h2>Attendance Configuration</h2>
          </div>
        </div>
        <div className="modal-form" style={{ padding: '24px' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Date</label>
              <input 
                type="date" 
                value={attendanceDate} 
                onChange={(e) => setAttendanceDate(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Select Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">Choose Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name || c.className || `Class ${c.id}`}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Subject</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <option value="">Choose Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name || s.subjectName || `Subject ${s.id}`} {s.code ? `(${s.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'flex-end' }}>
              <button 
                className="add-btn" 
                onClick={() => handleFetchStudents(1)} 
                disabled={!selectedClass || isStudentsLoading}
                style={{ width: '100%', height: '45px' }}
              >
                {isStudentsLoading ? <Loader2 className="animate-spin" /> : 'Load Students'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List Section */}
      {students.length > 0 && (
        <div className="mgmt-card animate-fadeIn">
          <div className="mgmt-header">
            <div className="mgmt-title-group">
              <h3>Attendance Registry</h3>
              <span className="count-badge">{Object.keys(markedStatuses).length} Marked Total</span>
            </div>
            <div className="mgmt-actions">
              <button 
                className="add-btn secondary" 
                onClick={() => {
                  const bulk = { ...markedStatuses };
                  students.forEach(s => bulk[s.id] = 'Present');
                  setMarkedStatuses(bulk);
                }}
              >
                Mark Page as Present
              </button>
              <div className="search-input">
                <Search size={18} />
                <input 
                  placeholder="Filter page..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="save-btn" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? 'Submitting...' : 'Submit All Marked'}
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Admission #</th>
                  <th>ID</th>
                  <th style={{ textAlign: 'center' }}>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.fullName || `${s.firstName} ${s.lastName}`}</div>
                    </td>
                    <td><span className="status-chip secondary">{s.admissionNumber || 'N/A'}</span></td>
                    <td><span className="count-badge">#{s.id}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="status-selector-group">
                        <button 
                          className={`status-btn present ${markedStatuses[s.id] === 'Present' ? 'active' : ''}`}
                          onClick={() => setStatus(s.id, 'Present')}
                        >
                          <CheckCircle size={16} />
                          <span>P</span>
                        </button>
                        <button 
                          className={`status-btn absent ${markedStatuses[s.id] === 'Absent' ? 'active' : ''}`}
                          onClick={() => setStatus(s.id, 'Absent')}
                        >
                          <XCircle size={16} />
                          <span>A</span>
                        </button>
                        <button 
                          className={`status-btn late ${markedStatuses[s.id] === 'Late' ? 'active' : ''}`}
                          onClick={() => setStatus(s.id, 'Late')}
                        >
                          <Clock size={16} />
                          <span>L</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-footer">
            <div className="pagination-info">
              Showing page {currentPage} of approximately {totalPages}
            </div>
            <div className="pagination-controls">
              <button 
                disabled={currentPage === 1 || isStudentsLoading}
                onClick={() => handleFetchStudents(currentPage - 1)}
              >
                Previous
              </button>
              <span className="page-num">{currentPage}</span>
              <button 
                disabled={currentPage === totalPages || isStudentsLoading}
                onClick={() => handleFetchStudents(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;
