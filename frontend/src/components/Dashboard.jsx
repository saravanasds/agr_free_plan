import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal.jsx';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState({
    mobileNumber: '',
    district: '',
    constituency: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/all');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.mobileNumber.includes(filter.mobileNumber) &&
      user.district.toLowerCase().includes(filter.district.toLowerCase()) &&
      user.constituency.toLowerCase().includes(filter.constituency.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [filter, users]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/\//g, '-');
  };

  if (error) {
    return <div>{error}</div>;
  }

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="mb-4">
        <input
          type="text"
          name="mobileNumber"
          placeholder="Filter by Mobile Number"
          value={filter.mobileNumber}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded mr-2"
        />
        <input
          type="text"
          name="district"
          placeholder="Filter by District"
          value={filter.district}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded mr-2"
        />
        <input
          type="text"
          name="constituency"
          placeholder="Filter by Constituency"
          value={filter.constituency}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Mobile Number</th>
              <th className="px-4 py-2 border-b">Constituency</th>
              <th className="px-4 py-2 border-b">Registered On</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="cursor-pointer" onClick={() => handleRowClick(user)}>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.mobileNumber}</td>
                <td className="px-4 py-2 border-b">{user.constituency}</td>
                <td className="px-4 py-2 border-b">{formatDate(user.updatedAt)}</td>
                <td className="px-4 py-2 border-b">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={(e) => { e.stopPropagation(); handleRowClick(user); }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && <Modal user={selectedUser} onClose={handleCloseModal} />}
    </div>
  );
};

export default Dashboard;
