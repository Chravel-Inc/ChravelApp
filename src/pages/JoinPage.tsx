import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, MapPin, Calendar } from 'lucide-react';
import { useJoinRequests } from '../contexts/JoinRequestContext';
import { JOIN_CODE_MAP } from '../types/joinRequests';

const JoinPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { addJoinRequest } = useJoinRequests();
  const [status, setStatus] = useState<'loading' | 'success' | 'duplicate' | 'error'>('loading');

  const tripData = code ? JOIN_CODE_MAP[code] : undefined;

  useEffect(() => {
    if (!code || !tripData) {
      setStatus('error');
      return;
    }

    const result = addJoinRequest(code);
    if (result) {
      // Check if this was already existing (duplicate detection)
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-black font-outfit flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {status === 'loading' && (
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock size={32} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Processing your request...</h2>
          </div>
        )}

        {status === 'success' && tripData && (
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Your request to join has been sent to the trip admin for approval.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">{tripData.title}</h3>
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <MapPin size={14} className="text-yellow-400" />
                <span className="text-sm">{tripData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} className="text-yellow-400" />
                <span className="text-sm">{tripData.dateRange}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-4 rounded-2xl transition-all duration-300"
            >
              Go to My Trips
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Join Link</h2>
            <p className="text-gray-400 mb-6">
              This join link is invalid or has expired. Please ask the trip admin for a new link.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 border border-gray-700"
            >
              Go to My Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinPage;
