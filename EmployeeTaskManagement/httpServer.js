import http from 'http';
import fs from 'fs';
import path from 'path';

const tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Amit Kumar",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "In Progress"
    }
];

const server = http.createServer((req, res) => {

    // A1 and A2: Home Route
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management System</h1>');
    }

    // A2 and A3: Get All Tasks
    else if (req.url === '/tasks' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }

    // A2: About Route
    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Employee Task Management Application</h1><p>Manage employee tasks efficiently.</p>');
    }

    // A4: Serve HTML using FS Module
    else if (req.url === '/home' && req.method === 'GET') {

        const filePath = path.join(process.cwd(), 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading HTML file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    // A3: Add New Task
    else if (req.url === '/add-task' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            try {
                const newTask = JSON.parse(body);

                const { id, taskName, assignedTo, status } = newTask;

                if (
                    id === undefined ||
                    !taskName ||
                    !assignedTo ||
                    !status ||
                    tasks.some(task => task.id === id)
                ) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid or duplicate task details' }));
                    return;
                }

                tasks.push({ id, taskName, assignedTo, status });

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: newTask
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
    }

    // A5: Invalid Route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }

});

// A1: Start Server
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});