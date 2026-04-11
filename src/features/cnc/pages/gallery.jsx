import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlay, FiPlus, FiImage, FiGrid, FiEye } from 'react-icons/fi';
import { imageService } from '../services/imageService'; 

const GalleryPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchImages = async (pageNum, currentFilter, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const isPattern = currentFilter === 'patterns' ? true : null;
      const data = await imageService.getMyImages(pageNum, isPattern);
      
      if (append) {
        setImages(prev => [...prev, ...data.results]); 
      } else {
        setImages(data.results); 
      }
      
      setHasNext(data.next !== null);

    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1); 
    fetchImages(1, filter, false);
  }, [filter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, filter, true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this image?")) {
      try {
        await imageService.deleteImage(id);
        setImages(images.filter(img => img.id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
  };

  return (
    <Container className="py-5 mt-4">
      <style>{`
        .gallery-card:hover .action-overlay { opacity: 1 !important; visibility: visible !important; }
        .action-overlay { opacity: 0; visibility: hidden; transition: all 0.3s ease; }
      `}</style>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3 fade-in-up">
        <div>
          <h1 className="display-5 fw-black text-theme mb-2">
            My <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-theme-muted mb-0">
            Manage your uploaded images and patterns.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/new-project')} 
          className="btn-primary-custom d-flex align-items-center justify-content-center gap-2"
        >
          <FiPlus size={20} /> Upload New
        </Button>
      </div>

      <div className="mb-4 p-1 rounded-4 d-inline-block" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
        <ButtonGroup>
          <Button
            variant={filter === 'all' ? 'primary' : 'link'}
            onClick={() => setFilter('all')}
            className={`fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2 ${filter === 'all' ? 'btn-primary-custom m-1' : 'text-theme-muted text-decoration-none'}`}
          >
            <FiImage /> All Images
          </Button>
          <Button
            variant={filter === 'patterns' ? 'primary' : 'link'}
            onClick={() => setFilter('patterns')}
            className={`fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2 ${filter === 'patterns' ? 'btn-primary-custom m-1' : 'text-theme-muted text-decoration-none'}`}
          >
            <FiGrid /> My Patterns
          </Button>
        </ButtonGroup>
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center py-5 my-5">
          <Spinner animation="grow" style={{ color: '#FF6B00' }} />
        </div>
      ) : images.length === 0 ? (
        <Card className="text-center p-5 modern-card border-0 my-4" style={{ backgroundColor: 'transparent', border: '1px dashed var(--glass-border) !important' }}>
          <Card.Body className="py-5">
            <FiImage size={60} className="text-theme-muted mb-3 opacity-50" />
            <h4 className="text-theme fw-bold">No images found</h4>
            <p className="text-theme-muted mb-0">
              You haven't uploaded any {filter === 'patterns' ? 'patterns' : 'images'} yet.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-4">
            <AnimatePresence>
              {images.map((img) => (
                <Col xs={12} sm={6} lg={3} key={img.id}>
                  <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" exit="exit" layout className="h-100">
                    <Card 
                      className="modern-card gallery-card h-100 border-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/gallery/${img.id}`)}
                    >
                      <div className="position-relative overflow-hidden" style={{ paddingTop: '65%' }}>
                        <Card.Img 
                          src={img.image_url} 
                          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" 
                        />
                        
                        {img.is_pattern && (
                          <Badge 
                            bg="primary" 
                            className="position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold rounded-pill"
                            style={{ boxShadow: '0 4px 10px rgba(255, 107, 0, 0.3)' }}
                          >
                            Pattern
                          </Badge>
                        )}

                        <div className="action-overlay position-absolute inset-0 d-flex align-items-center justify-content-center gap-3" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
                          <OverlayTrigger placement="top" overlay={<Tooltip>View Details</Tooltip>}>
                            <Button 
                              variant="light" 
                              className="rounded-circle p-2 d-flex align-items-center justify-content-center" 
                              style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} 
                              onClick={(e) => { e.stopPropagation(); navigate(`/gallery/${img.id}`); }}
                            >
                              <FiEye size={20} />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger placement="top" overlay={<Tooltip>Generate G-Code</Tooltip>}>
                            <Button 
                              variant="primary" 
                              className="rounded-circle p-2 d-flex align-items-center justify-content-center" 
                              style={{ width: '55px', height: '55px', backgroundColor: '#FF6B00', border: 'none', boxShadow: '0 5px 15px rgba(255,107,0,0.4)' }} 
                              onClick={(e) => { e.stopPropagation(); navigate('/new-project', { state: { selectedImageId: img.id, selectedImageUrl: img.image_url } }); }}
                            >
                              <FiPlay size={24} className="ms-1" />
                            </Button>
                          </OverlayTrigger>
                          
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete Image</Tooltip>}>
                            <Button 
                              variant="danger" 
                              className="rounded-circle p-2 d-flex align-items-center justify-content-center" 
                              style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#ff4d4d', border: 'none' }} 
                              onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                            >
                              <FiTrash2 size={20} />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </div>
                      
                      <Card.Body className="p-3 text-center">
                        <Card.Title className="h6 fw-bold text-theme mb-1 text-truncate">
                          {img.title}
                        </Card.Title>
                        <small className="text-theme-muted fw-bold">ID: #{img.id}</small>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>

          {hasNext && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex justify-content-center mt-5">
              <Button 
                variant="outline-primary" 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-5 py-2 rounded-pill fw-bold"
                style={{ borderColor: 'rgba(255, 107, 0, 0.4)', color: 'var(--primary-orange)' }}
              >
                {loadingMore ? 'Loading...' : 'Load More Images'}
              </Button>
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default GalleryPage;