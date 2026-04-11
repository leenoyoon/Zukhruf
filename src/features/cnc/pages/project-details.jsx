import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge, Stack } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTrash2, FiCpu, FiCheckCircle, FiEdit3, FiType, FiSave, FiCode, FiDownload } from 'react-icons/fi';
import { projectService } from '../services/projectService';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editData, setEditData] = useState({
    title: '',
    dimension_x: '',
    dimension_y: '',
    dimension_z: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gcodePreview, setGcodePreview] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectDetails(id);
        const projData = data.data || data;
        setProject(projData);
        
        setEditData({
          title: projData.title,
          dimension_x: projData.dimension_x,
          dimension_y: projData.dimension_y,
          dimension_z: projData.dimension_z
        });
        
        if (projData.gcode_preview) setGcodePreview(projData.gcode_preview);
      } catch (err) {        // eslint-disable-line no-unused-vars
        setError('Failed to load project details. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdateProject = async () => {
    setIsUpdating(true);
    try {
      const response = await projectService.updateProject(id, {
        title: editData.title,
        dimension_x: editData.dimension_x,
        dimension_y: editData.dimension_y,
        dimension_z: editData.dimension_z
      });
      const updatedProj = response.data || response;
      setProject(updatedProj);
      
      const successAlert = document.getElementById('update-success');
      if(successAlert) {
        successAlert.style.opacity = 1;
        setTimeout(() => successAlert.style.opacity = 0, 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project permanently?")) {
      try {
        await projectService.deleteProject(id);
        navigate('/history');
      } catch (err) {        // eslint-disable-line no-unused-vars
        alert("Delete failed.");
      }
    }
  };

  const handleGenerateGCode = async () => {
    setIsGenerating(true);
    try {
      const response = await projectService.generateGcode(id, project.title);
      if (response.status === 1) {
        setGcodePreview(response.data.gcode_preview);
        setProject(response.data.project);
      }
    } catch (err) {        // eslint-disable-line no-unused-vars
      alert('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-deep)',
    color: 'var(--text-main)',
    borderColor: 'var(--glass-border)'
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="grow" style={{ color: '#FF6B00', width: '3rem', height: '3rem' }} />
    </Container>
  );

  if (error) return (
    <Container className="py-5 mt-5 text-center">
      <Alert variant="danger" className="d-inline-block rounded-4 fw-bold">{error}</Alert>
    </Container>
  );

  return (
    <Container className="py-5 mt-4">
      <style>{`
        .custom-input:focus { background-color: var(--bg-deep); color: var(--text-main); border-color: var(--primary-orange); box-shadow: 0 0 0 0.25rem rgba(255, 107, 0, 0.25); }
        .gcode-terminal {
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          font-size: 0.85rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>

      <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          variant="link" 
          onClick={() => navigate('/history')}
          className="text-theme-muted text-decoration-none p-0 d-flex align-items-center gap-2 fw-bold"
          style={{ transition: 'color 0.3s' }}
          onMouseEnter={(e) => e.target.style.color = '#FF6B00'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-muted-custom)'}
        >
          <FiArrowLeft size={20} /> Back to Projects
        </Button>

        <Button 
          variant="link" 
          onClick={handleDeleteProject}
          className="text-danger text-decoration-none p-0 d-flex align-items-center gap-2 fw-bold opacity-75 hover-opacity-100"
        >
          <FiTrash2 size={20} /> Delete Project
        </Button>
      </motion.div>

      <Row className="g-4">
        <Col xs={12} lg={4} as={motion.div} variants={fadeUpVariant} initial="hidden" animate="visible">
          <Stack gap={4}>
            
            <Card className="modern-card border-0">
              <div className="position-relative" style={{ paddingTop: '55%', overflow: 'hidden' }}>
                <Card.Img src={project.image_url} className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
              </div>
              <Card.Body className="p-4 text-center">
                <h5 className="fw-bold text-theme mb-3">{project.title}</h5>
                <Badge 
                  bg={project.status === 'completed' ? 'success' : 'primary'} 
                  className="px-4 py-2 rounded-pill fw-bold text-uppercase d-inline-flex align-items-center gap-2"
                  style={{ boxShadow: project.status === 'completed' ? '0 4px 10px rgba(25, 135, 84, 0.3)' : '0 4px 10px rgba(255, 107, 0, 0.3)' }}
                >
                  {project.status === 'completed' ? <FiCheckCircle size={16} /> : <FiCpu size={16} />}
                  {project.status || 'UNKNOWN'}
                </Badge>
              </Card.Body>
            </Card>

            <Card className="modern-card border-0">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FiEdit3 size={20} className="text-primary" />
                  <h6 className="fw-bold text-theme mb-0">Edit Project Info</h6>
                </div>

                <Alert id="update-success" variant="success" className="p-2 text-center rounded-3 fw-bold small" style={{ opacity: 0, transition: 'opacity 0.3s', position: 'absolute', top: '-10px', left: 0, right: 0 }}>
                  Updated Successfully!
                </Alert>

                <Form className="d-flex flex-column gap-3">
                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small d-flex align-items-center gap-2">
                      <FiType /> Project Title
                    </Form.Label>
                    <Form.Control 
                      className="custom-input p-2 rounded-3" style={inputStyle}
                      value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})}
                    />
                  </Form.Group>
                  
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="text-theme fw-bold small">Width (X)</Form.Label>
                        <Form.Control type="number" className="custom-input p-2 rounded-3" style={inputStyle} value={editData.dimension_x} onChange={(e) => setEditData({...editData, dimension_x: e.target.value})} />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="text-theme fw-bold small">Height (Y)</Form.Label>
                        <Form.Control type="number" className="custom-input p-2 rounded-3" style={inputStyle} value={editData.dimension_y} onChange={(e) => setEditData({...editData, dimension_y: e.target.value})} />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group>
                    <Form.Label className="text-theme fw-bold small">Safe Height (Z)</Form.Label>
                    <Form.Control type="number" className="custom-input p-2 rounded-3" style={inputStyle} value={editData.dimension_z} onChange={(e) => setEditData({...editData, dimension_z: e.target.value})} />
                  </Form.Group>
                  
                  <Button 
                    onClick={handleUpdateProject} disabled={isUpdating}
                    variant="success" className="w-100 py-3 mt-2 fw-bold d-flex justify-content-center align-items-center gap-2"
                    style={{ border: 'none', boxShadow: '0 8px 20px rgba(25, 135, 84, 0.3)' }}
                  >
                    {isUpdating ? <Spinner size="sm" /> : <FiSave size={18} />}
                    {isUpdating ? 'SAVING...' : 'SAVE CHANGES'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Stack>
        </Col>

        <Col xs={12} lg={8} as={motion.div} variants={fadeUpVariant} initial="hidden" animate="visible">
          <Card className="modern-card border-0 h-100 d-flex flex-column" style={{ minHeight: '600px', overflow: 'hidden' }}>
            
            <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3" style={{ borderColor: 'var(--glass-border) !important', backgroundColor: 'var(--glass-bg)' }}>
              <div>
                <h5 className="fw-bold text-theme mb-1 d-flex align-items-center gap-2">
                  <FiCode className="text-primary" /> G-Code Generator
                </h5>
                <small className="text-theme-muted">Process project to generate toolpaths.</small>
              </div>
              
              <div className="d-flex gap-2">
                <Button 
                  onClick={handleGenerateGCode} disabled={isGenerating}
                  className="btn-primary-custom px-4 py-2 fw-bold d-flex align-items-center gap-2"
                >
                  {isGenerating ? <Spinner size="sm" /> : <FiCpu size={18} />}
                  {isGenerating ? 'PROCESSING...' : 'GENERATE'}
                </Button>

                <Button 
                  href={project.gcode_file_url || '#'} 
                  target="_blank" 
                  download 
                  disabled={!project.gcode_file_url}
                  className="px-4 py-2 fw-bold d-flex align-items-center gap-2 text-decoration-none transition-all"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: `2px solid ${project.gcode_file_url ? 'var(--primary-orange)' : 'var(--glass-border)'}`,
                    color: project.gcode_file_url ? 'var(--primary-orange)' : 'var(--text-muted-custom)',
                    borderRadius: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if(project.gcode_file_url) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if(project.gcode_file_url) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <FiDownload size={18} /> DOWNLOAD
                </Button>
              </div>
            </div>

            <Card.Body className="p-0 flex-grow-1 position-relative" style={{ backgroundColor: '#090a0f' }}>
              <div className="position-absolute inset-0 p-4 overflow-auto gcode-terminal" style={{ color: gcodePreview ? '#4caf50' : 'rgba(255,255,255,0.3)' }}>
                {gcodePreview || "// Awaiting command...\n// Click 'GENERATE' to process image and view G-Code toolpaths."}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetailsPage;