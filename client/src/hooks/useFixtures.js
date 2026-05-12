import { useState, useEffect } from 'react';
import { fixtureService } from '../services/fixtureService';

export const useFixtures = (params) => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await fixtureService.getFixtures(params);
        setFixtures(data.data.fixtures);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load fixtures');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [JSON.stringify(params)]);

  return { fixtures, loading, error };
};
