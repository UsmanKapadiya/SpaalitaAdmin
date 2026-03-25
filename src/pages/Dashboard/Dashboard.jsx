import React, { useEffect, useState, useMemo } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Button from '../../components/Button/Button';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import DashboardService from '../../services/dashBordServices';
import './Dashboard.css';


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await DashboardService.getDashboardStats();

      if (res.success) {
        setDashboardData(res.data);
      } else {
        setError(res.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);


  const stats = useMemo(() => [
    {
      icon: <ShoppingCartIcon />,
      value: dashboardData?.totalOrders ?? 0,
      label: 'Total Orders',
      color: 'success',
    },
    {
      icon: <CheckCircleIcon />,
      value: dashboardData?.completedOrders ?? 0,
      label: 'Completed Orders',
      color: 'success',
    },
    {
      icon: <PendingActionsIcon />,
      value: dashboardData?.pendingOrders ?? 0,
      label: 'Pending Orders',
      color: 'warning',
    },
    {
      icon: <CancelIcon />,
      value: dashboardData?.cancelledOrders ?? 0,
      label: 'Cancelled Orders',
      color: 'error',
    },
    {
      icon: <PeopleIcon />,
      value: dashboardData?.activeUsers ?? 0,
      label: 'Active Users',
      color: 'primary',
    },
    {
      icon: <TrendingUpIcon />,
      value: dashboardData?.totalProducts ?? 0,
      label: 'Total Products',
      color: 'success',
    },
    {
      icon: <CardGiftcardIcon />,
      value: dashboardData?.totalGiftCards ?? 0,
      label: 'Total Gift Cards',
      color: 'secondary',
    },
  ], [dashboardData]);

  return (
    <DashboardLayout>
      <PageTitle
        title="Dashboard"
        subTitle="Welcome back! Here's what's happening with your business today."
        button={false}
      />

      {loading ? (
        <div className="center-box">
          <GlobalLoader text="Loading dashboard..." />
        </div>
      ) : error ? (
        <div className="center-box error-text">
          <p>{error}</p>
          <div className="retry-btn-wrapper">
            <Button
              className="btn-add"
              type="button"
              onClick={fetchDashboardStats}
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
