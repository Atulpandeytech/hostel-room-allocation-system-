document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('hostelForm');
    const tableBody = document.getElementById('studentTableBody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetSearchBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const totalStudents = document.getElementById('totalStudents');
    const roomsUsed = document.getElementById('roomsUsed');
    const submitBtn = document.getElementById('submitBtn');

    let students = JSON.parse(localStorage.getItem('hostelStudents')) || [];
    let editId = null;

    function render() {
        tableBody.innerHTML = '';
        if (students.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No students found</td></tr>';
        } else {
            students.forEach(student => {
                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.room}</td>
                        <td>${student.year}</td>
                        <td>${student.email}</td>
                        <td>
                            <button class="edit" data-id="${student.id}">Edit</button>
                            <button class="delete" data-id="${student.id}">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
        updateStats();
        addEventListeners();
    }

    function updateStats() {
        totalStudents.textContent = students.length;
        const uniqueRooms = [...new Set(students.map(s => s.room))];
        roomsUsed.textContent = uniqueRooms.length;
    }

    function addEventListeners() {
        document.querySelectorAll('.edit').forEach(btn => {
            btn.onclick = () => {
                const id = +btn.dataset.id;
                const student = students.find(s => s.id === id);
                if (student) {
                    document.getElementById('studentId').value = student.id;
                    document.getElementById('name').value = student.name;
                    document.getElementById('roll').value = student.roll;
                    document.getElementById('room').value = student.room;
                    document.getElementById('year').value = student.year;
                    document.getElementById('email').value = student.email;
                    editId = id;
                    submitBtn.textContent = 'Update Student';
                }
            };
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.onclick = () => {
                const id = +btn.dataset.id;
                if (confirm('Delete this student?')) {
                    students = students.filter(s => s.id !== id);
                    save();
                    render();
                }
            };
        });
    }

    function save() {
        localStorage.setItem('hostelStudents', JSON.stringify(students));
    }

    form.onsubmit = e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const roll = document.getElementById('roll').value.trim();
        const room = document.getElementById('room').value.trim();
        const year = +document.getElementById('year').value;
        const email = document.getElementById('email').value.trim();

        if (editId !== null) {
            students = students.map(s => s.id === editId ? { id: editId, name, roll, room, year, email } : s);
            editId = null;
            submitBtn.textContent = 'Add Student';
        } else {
            const newStudent = {
                id: Date.now(),
                name,
                roll,
                room,
                year,
                email
            };
            students.push(newStudent);
        }
        form.reset();
        save();
        render();
    };

    cancelBtn.onclick = () => {
        form.reset();
        editId = null;
        submitBtn.textContent = 'Add Student';
    };

    searchBtn.onclick = () => {
        const query = searchInput.value.toLowerCase();
        const results = students.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.roll.toLowerCase().includes(query) ||
            s.room.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query)
        );
        tableBody.innerHTML = '';
        if (results.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No match found</td></tr>';
        } else {
            results.forEach(student => {
                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.room}</td>
                        <td>${student.year}</td>
                        <td>${student.email}</td>
                        <td>
                            <button class="edit" data-id="${student.id}">Edit</button>
                            <button class="delete" data-id="${student.id}">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            addEventListeners();
        }
    };

    resetBtn.onclick = () => {
        searchInput.value = '';
        render();
    };

    render();
});
