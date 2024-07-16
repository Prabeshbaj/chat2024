import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store'; // Adjust the import according to your store setup
import { fetchLabels, fetchTopics, selectLabel, deselectLabel } from './sidebarSlice';

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
  const status = useSelector((state: RootState) => state.sidebar.status);
  const error = useSelector((state: RootState) => state.sidebar.error);

  const [showRecent, setShowRecent] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLabels(crewId));
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

  return (
    <div className="container">
      <div className="mainLabel">
        <h2>Options</h2>
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
      </div>
      <div className={`subLabel ${(showRecent || showPinned || currentLabel) ? 'visible' : ''}`}>
        <button onClick={handleClose}>Close</button>
        {showRecent && (
          <>
            <h3>Recent Topics</h3>
            {recentTopics.map((topic) => (
              <div key={topic.requestId} className="topic">
                {topic.label}: {topic.topic}
              </div>
            ))}
          </>
        )}
        {showPinned && (
          <>
            <h3>Pinned Topics</h3>
            {pinnedTopics.map((topic) => (
              <div key={topic.requestId} className="topic">
                {topic.label}: {topic.topic}
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
                  {topic.topic}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
