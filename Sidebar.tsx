import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store'; // Adjust the import according to your store setup
import { fetchLabels, fetchTopics, selectLabel, deselectLabel } from './sidebarSlice';

interface SidebarProps {
  crewId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ crewId }) => {
  const dispatch = useDispatch();
  const labels = useSelector((state: RootState) => state.sidebar.labels);
  const topics = useSelector((state: RootState) => state.sidebar.topics);
  const recentTopics = useSelector((state: RootState) => state.sidebar.recentTopics);
  const pinnedTopics = useSelector((state: RootState) => state.sidebar.pinnedTopics);
  const selectedLabel = useSelector((state: RootState) => state.sidebar.selectedLabel);
  const status = useSelector((state: RootState) => state.sidebar.status);
  const error = useSelector((state: RootState) => state.sidebar.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLabels(crewId));
      dispatch(fetchTopics(crewId));
    }
  }, [status, dispatch, crewId]);

  const handleLabelClick = (label: string) => {
    dispatch(selectLabel(label));
  };

  const handleClose = () => {
    dispatch(deselectLabel());
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <h2>Labels</h2>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'failed' && <div>{error}</div>}
        <div className="recent">
          <h3>Recent</h3>
          {recentTopics.map((topic) => (
            <div key={topic.requestId} className="topic">
              {topic.label}: {topic.topic}
            </div>
          ))}
        </div>
        <div className="pinned">
          <h3>Pinned</h3>
          {pinnedTopics.map((topic) => (
            <div key={topic.requestId} className="topic">
              {topic.label}: {topic.topic}
            </div>
          ))}
        </div>
        {labels.map((label) => (
          <div key={label} className="label" onClick={() => handleLabelClick(label)}>
            <h3>{label}</h3>
          </div>
        ))}
      </div>
      {selectedLabel && (
        <div className="topics-container" style={{ width: '300px', height: '100%', position: 'absolute', right: 0, top: 0 }}>
          <button onClick={handleClose}>Close</button>
          <h3>{selectedLabel}</h3>
          {topics[selectedLabel] &&
            topics[selectedLabel].map((topic) => (
              <div key={topic.requestId} className="topic">
                {topic.topic}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
