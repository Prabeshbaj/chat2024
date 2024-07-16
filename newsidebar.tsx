import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLabels());
      dispatch(fetchTopics(crewId));
    }
  }, [status, dispatch, crewId]);

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

  const toggleMenu = (requestId: string) => {
    if (visibleMenu === requestId) {
      setVisibleMenu(null);
    } else {
      setVisibleMenu(requestId);
    }
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
      <div className={`subLabel ${(showRecent || showPinned || currentLabel) ? 'visible' : ''}`}>
        <button onClick={handleClose}>Close</button>
        {showRecent && (
          <>
            <h3>Recent Topics</h3>
            {recentTopics.map((topic) => (
              <div key={topic.requestId} className="topic">
                <span>{topic.label}</span>
                <span className="topic-box">{topic.topic}</span>
                <div className="topic-menu">
                  <span className="topic-menu-icon" onClick={() => toggleMenu(topic.requestId)}>⋮</span>
                  {visibleMenu === topic.requestId && (
                    <div className="topic-dropdown visible">
                      <a href="#">Rename</a>
                      <a href="#">Label</a>
                      <a href="#">Pin</a>
                      <a href="#">Archive</a>
                      <a href="#">Delete</a>
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
                <span>{topic.label}</span>
                <span className="topic-box">{topic.topic}</span>
                <div className="topic-menu">
                  <span className="topic-menu-icon" onClick={() => toggleMenu(topic.requestId)}>⋮</span>
                  {visibleMenu === topic.requestId && (
                    <div className="topic-dropdown visible">
                      <a href="#">Rename</a>
                      <a href="#">Label</a>
                      <a href="#">Pin</a>
                      <a href="#">Archive</a>
                      <a href="#">Delete</a>
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
                  <span>{topic.label}</span>
                  <span className="topic-box">{topic.topic}</span>
                  <div className="topic-menu">
                    <span className="topic-menu-icon" onClick={() => toggleMenu(topic.requestId)}>⋮</span>
                    {visibleMenu === topic.requestId && (
                      <div className="topic-dropdown visible">
                        <a href="#">Rename</a>
                        <a href="#">Label</a>
                        <a href="#">Pin</a>
                        <a href="#">Archive</a>
                        <a href="#">Delete</a>
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
