import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store'; // Adjust the import according to your store setup
import { fetchLabels, fetchTopics, selectLabel, deselectLabel, createLabel, selectRadioButton, setCurrentRequestID } from './sidebarSlice';
import Modal from './Modal'; // Ensure the correct path to your Modal component

interface SidebarProps {
  crewId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ crewId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const labels = useSelector((state: RootState) => state.sidebar.labels);
  const topics = useSelector((state: RootState) => state.sidebar.topics);
  const recentTopics = useSelector((state: RootState) => state.sidebar.recentTopics);
  const pinnedTopics = useSelector((state: RootState) => state.sidebar.pinnedTopics);
  const selectedLabel = useSelector((state: RootState) => state.sidebar.selectedLabel);
  const selectedRadioButton = useSelector((state: RootState) => state.sidebar.selectedRadioButton);
  const currentRequestID = useSelector((state: RootState) => state.sidebar.currentRequestID);
  const status = useSelector((state: RootState) => state.sidebar.status);
  const error = useSelector((state: RootState) => state.sidebar.error);

  const [showRecent, setShowRecent] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLabels());
      dispatch(fetchTopics(crewId));
    }
  }, [status, dispatch, crewId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setVisibleMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  const handleLabelClick = (label: string) => {
    if (currentLabel === label) {
      dispatch(deselectLabel());
      setCurrentLabel(null);
    } else {
      dispatch(selectLabel(label));
      setCurrentLabel(label);
      setShowRecent(false);
      setShowPinned(false);
    }
  };

  const handleClose = () => {
    dispatch(deselectLabel());
    setCurrentLabel(null);
    setShowRecent(false);
    setShowPinned(false);
  };

  const toggleRecent = () => {
    setShowRecent(!showRecent);
    setShowPinned(false); // Ensure Pinned is not shown when Recent is clicked
    dispatch(deselectLabel());
    setCurrentLabel(null);
  };

  const togglePinned = () => {
    setShowPinned(!showPinned);
    setShowRecent(false); // Ensure Recent is not shown when Pinned is clicked
    dispatch(deselectLabel());
    setCurrentLabel(null);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateLabel = (labelName: string) => {
    dispatch(createLabel(labelName));
    closeModal();
  };

  const handleRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(selectRadioButton(event.target.value));
  };

  const handleTopicClick = (requestId: string) => {
    dispatch(setCurrentRequestID(requestId));
  };

  const toggleMenu = (event: React.MouseEvent<HTMLSpanElement>, requestId: string) => {
    if (visibleMenu === requestId) {
      setVisibleMenu(null);
      setMenuPosition(null);
    } else {
      setVisibleMenu(requestId);
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const parentRect = sidebarRef.current?.getBoundingClientRect();
      const parentLeft = parentRect ? parentRect.left : 0;
      const parentRight = parentRect ? parentRect.right : window.innerWidth;

      let left = rect.left + window.scrollX;
      if (left + 150 > parentRight) {
        left = parentRight - 150;
      }

      setMenuPosition({ top: rect.top + window.scrollY, left: Math.max(left, parentLeft) });
    }
  };

  const truncateLabel = (label: string, maxLength: number) => {
    if (label.length <= maxLength) return label;
    return label.substring(0, maxLength) + '...';
  };

  return (
    <div className="container">
      {isSidebarVisible && (
        <div className="mainLabel">
          <h2>Options</h2>
          <button onClick={openModal}>New Label</button>
          {status === 'loading' && <div>Loading...</div>}
          {status === 'failed' && <div>{error}</div>}
          <div className="recent" onClick={toggleRecent}>
            <h3>Recent</h3>
          </div>
          <div className="pinned" onClick={togglePinned}>
            <h3>Pinned</h3>
          </div>
          {labels.map((label) => (
            <div key={label} className="label" onClick={() => handleLabelClick(label)}>
              <h3>{label}</h3>
            </div>
          ))}
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                name="options"
                value="option1"
                checked={selectedRadioButton === 'option1'}
                onChange={handleRadioButtonChange}
              />
              Option 1
            </label>
            <label>
              <input
                type="radio"
                name="options"
                value="option2"
                checked={selectedRadioButton === 'option2'}
                onChange={handleRadioButtonChange}
              />
              Option 2
            </label>
          </div>
        </div>
      )}
      <div className={`subLabel ${(showRecent || showPinned || currentLabel) ? 'visible' : ''}`} ref={sidebarRef}>
        <button onClick={handleClose}>Close</button>
        {showRecent && (
          <>
            <h3>Recent Topics</h3>
            {recentTopics.map((topic) => (
              <div key={topic.requestId} className="topic">
                <span className="topic-label">{truncateLabel(topic.label, 5)}</span>
                <span className="topic-box">{topic.topic}</span>
                <div className="topic-menu">
                  <span className="topic-menu-icon" onClick={(event) => toggleMenu(event, topic.requestId)}>⋮</span>
                  {visibleMenu === topic.requestId && (
                    <div className="topic-dropdown visible" style={{ top: menuPosition?.top, left: menuPosition?.left }}>
                      <a href="#"><img src="path/to/rename-icon.png" alt="Rename" />Rename</a>
                      <a href="#"><img src="path/to/label-icon.png" alt="Label" />Label</a>
                      <a href="#"><img src="path/to/pin-icon.png" alt="Pin" />Pin</a>
                      <a href="#"><img src="path/to/archive-icon.png" alt="Archive" />Archive</a>
                      <a href="#"><img src="path/to/delete-icon.png" alt="Delete" />Delete</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
        {showPinned && (
          <>
            <h3>Pinned Topics</h3>
            {pinnedTopics.map((topic) => (
              <div key={topic.requestId} className="topic">
                <span className="topic-label">{truncateLabel(topic.label, 5)}</span>
                <span className="topic-box">{topic.topic}</span>
                <div className="topic-menu">
                  <span className="topic-menu-icon" onClick={(event) => toggleMenu(event, topic.requestId)}>⋮</span>
                  {visibleMenu === topic.requestId && (
                    <div className="topic-dropdown visible" style={{ top: menuPosition?.top, left: menuPosition?.left }}>
                      <a href="#"><img src="path/to/rename-icon.png" alt="Rename" />Rename</a>
                      <a href="#"><img src="path/to/label-icon.png" alt="Label" />Label</a>
                      <a href="#"><img src="path/to/pin-icon.png" alt="Pin" />Pin</a>
                      <a href="#"><img src="path/to/archive-icon.png" alt="Archive" />Archive</a>
                      <a href="#"><img src="path/to/delete-icon.png" alt="Delete" />Delete</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
        {currentLabel && !showRecent && !showPinned && (
          <>
            <h3>{currentLabel}</h3>
            {topics[currentLabel] &&
              topics[currentLabel].map((topic) => (
                <div key={topic.requestId} className="topic">
                  <span className="topic-label">{truncateLabel(topic.label, 5)}</span>
                  <span className="topic-box">{topic.topic}</span>
                  <div className="topic-menu">
                    <span className="topic-menu-icon" onClick={(event) => toggleMenu(event, topic.requestId)}>⋮</span>
                    {visibleMenu === topic.requestId && (
                      <div className="topic-dropdown visible" style={{ top: menuPosition?.top, left: menuPosition?.left }}>
                        <a href="#"><img src="path/to/rename-icon.png" alt="Rename" />Rename</a>
                        <a href="#"><img src="path/to/label-icon.png" alt="Label" />Label</a>
                        <a href="#"><img src="path/to/pin-icon.png" alt="Pin" />Pin</a>
                        <a href="#"><img src="path/to/archive-icon.png" alt="Archive" />Archive</a>
                        <a href="#"><img src="path/to/delete-icon.png" alt="Delete" />Delete</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
      <div className="hamburger" onClick={toggleSidebar}>
        &#9776; {/* Unicode for hamburger menu icon */}
      </div>
      <Modal show={isModalOpen} onClose={closeModal} onCreate={handleCreateLabel} />
    </div>
  );
};

export default Sidebar;
