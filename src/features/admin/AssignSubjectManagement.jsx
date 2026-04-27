import { useState, useEffect, useCallback } from 'react';
import { Search, User, Book, Trash2, Plus, Loader2, ChevronRight } from 'lucide-react';
import { getAllStaff, getStaffSubjects, assignSubjects, removeSubjectFromStaff } from '../../services/staffService';
import { subjectService } from '../../services/academicServices';
import GenericModal from './GenericModal';

const AssignSubjectManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffSubjects, setStaffSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [staffRes, subRes] = await Promise.all([
        getAllStaff(),
        subjectService.getAll()
      ]);
      setStaffList(staffRes.data.data || staffRes.data || []);
      setAllSubjects(subRes.data.data || subRes.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStaffSelect = async (staff) => {
    setSelectedStaff(staff);
    setIsSubjectsLoading(true);
    try {
      const response = await getStaffSubjects(staff.id);
      setStaffSubjects(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching staff subjects:', error);
      setStaffSubjects([]);
    } finally {
      setIsSubjectsLoading(false);
    }
  };

  const handleRemoveSubject = async (subjectId) => {
    if (!selectedStaff?.id || !subjectId) {
      alert('Error: Missing staff or subject identifier');
      return;
    }

    if (!window.confirm('Remove this subject assignment?')) return;
    
    try {
      console.log(`Removing assignment: StaffID=${selectedStaff.id}, SubjectID=${subjectId}`);
      await removeSubjectFromStaff(selectedStaff.id, subjectId);
      handleStaffSelect(selectedStaff); // Refresh list
    } catch (error) {
      console.error('Removal failed:', error);
      alert('Failed to remove subject: ' + (error.message || 'Unknown error'));
    }
  };

  const handleAssignSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Expecting formData to have subjectId
      await assignSubjects(selectedStaff.id, [parseInt(formData.subjectId)]);
      setIsModalOpen(false);
      handleStaffSelect(selectedStaff); // Refresh list
    } catch (error) {
      console.error(error);
      alert('Failed to assign subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStaff = staffList.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="assignment-container">
      <div className="assignment-grid">
        {/* Staff List Panel */}
        <div className="mgmt-card staff-panel">
          <div className="mgmt-header">
            <h3>Select Staff</h3>
            <div className="search-input" style={{ width: '100%', marginTop: '12px' }}>
              <Search size={18} />
              <input 
                placeholder="Search staff..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="staff-list-scroll">
            {isLoading ? (
              <div className="table-loader"><Loader2 className="animate-spin" /></div>
            ) : filteredStaff.length === 0 ? (
              <div className="empty-state">No staff found</div>
            ) : (
              filteredStaff.map(staff => (
                <div 
                  key={staff.id} 
                  className={`staff-item ${selectedStaff?.id === staff.id ? 'active' : ''}`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  <div className="staff-avatar">
                    <User size={20} />
                  </div>
                  <div className="staff-info">
                    <p className="name">{staff.firstName} {staff.lastName}</p>
                    <p className="dept">{staff.designation}</p>
                  </div>
                  <ChevronRight size={16} className="arrow" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subjects Panel */}
        <div className="mgmt-card subjects-panel">
          {selectedStaff ? (
            <>
              <div className="mgmt-header">
                <div className="header-with-action">
                  <h3>Assigned Subjects</h3>
                  <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Assign New
                  </button>
                </div>
                <p className="staff-subtitle">Managing subjects for <strong>{selectedStaff.firstName} {selectedStaff.lastName}</strong></p>
              </div>
              
              <div className="assigned-list">
                {isSubjectsLoading ? (
                  <div className="table-loader"><Loader2 className="animate-spin" /></div>
                ) : staffSubjects.length === 0 ? (
                  <div className="empty-state">No subjects assigned yet</div>
                ) : (
                  staffSubjects.map((subject, index) => {
                    // Resilient ID extraction (check nested subject object if exists)
                    const sId = subject.subjectId || subject.id || subject.subject?.id;
                    const sName = subject.name || subject.subjectName || subject.subject?.name;
                    const sCode = subject.code || subject.subjectCode || subject.subject?.code;
                    const sCredits = subject.credits || subject.subject?.credits;

                    return (
                      <div key={sId || index} className="subject-card">
                        <div className="subject-icon">
                          <Book size={20} />
                        </div>
                        <div className="subject-info">
                          <p className="sub-name">{sName || 'Unnamed Subject'}</p>
                          <p className="sub-code">{sCode || 'N/A'} • {sCredits || 0} Credits</p>
                        </div>
                        <button 
                          className="remove-btn" 
                          onClick={() => handleRemoveSubject(sId)}
                          title="Remove Assignment"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="empty-state-full">
              <Book size={48} />
              <h3>No Staff Selected</h3>
              <p>Please select a staff member from the left panel to view and manage their assigned subjects.</p>
            </div>
          )}
        </div>
      </div>

      <GenericModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAssignSubmit}
        isLoading={isSubmitting}
        title="Subject Assignment"
        fields={[
          { 
            name: 'subjectId', 
            label: 'Select Subject', 
            type: 'select', 
            required: true,
            options: allSubjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }))
          }
        ]}
      />
    </div>
  );
};

export default AssignSubjectManagement;
