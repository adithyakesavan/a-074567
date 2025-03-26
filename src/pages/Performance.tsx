
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Lightbulb, ArrowLeft, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts
const monthlyData = [
  { name: 'Jan', tasks: 12, completed: 10 },
  { name: 'Feb', tasks: 19, completed: 15 },
  { name: 'Mar', tasks: 15, completed: 12 },
  { name: 'Apr', tasks: 21, completed: 18 },
  { name: 'May', tasks: 18, completed: 14 },
  { name: 'Jun', tasks: 14, completed: 12 },
];

const statusData = [
  { name: 'Completed', value: 65 },
  { name: 'In Progress', value: 25 },
  { name: 'Overdue', value: 10 },
];

const COLORS = ['#7EBF8E', '#61AAF2', '#E57373'];

const Performance = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  // Sample task history data
  const taskHistory = [
    { id: 1, title: 'Create project proposal', status: 'Completed', date: '2025-01-15', priority: 'High' },
    { id: 2, title: 'Review team performance', status: 'Completed', date: '2025-01-20', priority: 'Medium' },
    { id: 3, title: 'Update documentation', status: 'Completed', date: '2025-01-18', priority: 'Low' },
    { id: 4, title: 'Prepare quarterly report', status: 'Completed', date: '2025-02-05', priority: 'High' },
    { id: 5, title: 'Client meeting preparation', status: 'Completed', date: '2025-02-10', priority: 'Medium' },
    { id: 6, title: 'Fix UI bugs', status: 'Completed', date: '2025-02-15', priority: 'Medium' },
  ];

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-red-500" />;
    }
  };

  // Function to get priority class
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <CheckSquare className="w-6 h-6 text-dashboard-accent2" />
          <h1 className="text-2xl font-bold">Task Tracker</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/about')}
          >
            About
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80"
            onClick={() => navigate('/contact')}
          >
            Contact
          </Button>
          <div 
            className="cursor-grab active:cursor-grabbing"
            draggable
            onDragEnd={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Lightbulb className="h-5 w-5 text-yellow-300" />
          </div>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-10">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">My Performance</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-xl font-medium mb-4">Task Completion Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" tick={{ fill: '#C4C3BB' }} />
                  <YAxis tick={{ fill: '#C4C3BB' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A19', 
                      borderColor: 'rgba(255,255,255,0.1)' 
                    }} 
                  />
                  <Bar dataKey="tasks" name="Total Tasks" fill="#8989DE" />
                  <Bar dataKey="completed" name="Completed" fill="#7EBF8E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-medium mb-4">Task Status Distribution</h2>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A19', 
                      borderColor: 'rgba(255,255,255,0.1)' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-medium mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-dashboard-accent1">85%</p>
              <p className="text-sm text-gray-400">Completion Rate</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-dashboard-accent2">24</p>
              <p className="text-sm text-gray-400">Tasks Created</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-dashboard-accent3">18</p>
              <p className="text-sm text-gray-400">Tasks Completed</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-yellow-500">2.5</p>
              <p className="text-sm text-gray-400">Avg. Days to Complete</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Recent Task History</h2>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-400">Last 30 days</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium">Task</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 font-medium">Completed Date</th>
                </tr>
              </thead>
              <tbody>
                {taskHistory.map(task => (
                  <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4">{task.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <span>{task.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{new Date(task.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 border-t border-white/10 mt-20">
        <div className="text-center text-gray-400">
          <p>Copyrights 2025. Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Performance;
