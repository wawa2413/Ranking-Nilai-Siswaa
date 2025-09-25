// ===== VARIABEL GLOBAL =====
        let studentsData = [];
        let sortedStudents = [];

// ===== INISIALISASI =====
        document.addEventListener('DOMContentLoaded', function() {
            updateStudentInputs();
            
    // Tambahkan event Enter untuk pencarian siswa
            document.getElementById('searchName').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchStudent();
                }
            });
        });

// ===== MANAJEMEN INPUT SISWA =====
        function updateStudentInputs() {
            const count = parseInt(document.getElementById('studentCount').value);
            const container = document.getElementById('studentsGrid');
            
            if (count < 1 || count > 100) {
                alert('Jumlah siswa harus antara 1-100!');
                document.getElementById('studentCount').value = 10;
                return;
            }

            container.innerHTML = '';

            for (let i = 0; i < count; i++) {
                const studentRow = document.createElement('div');
                studentRow.className = 'student-row';
                studentRow.innerHTML = `
                    <div class="student-number">${i + 1}</div>
                    <input type="text" placeholder="Nama lengkap siswa" id="name_${i}" maxlength="50">
                    <input type="text" placeholder="Kelas (X-1, XI-A)" id="class_${i}" maxlength="10">
                    <input type="number" placeholder="Nilai" id="score_${i}" min="0" max="100" step="0.01">
                    <button class="remove-btn" onclick="removeStudentRow(${i})" title="Hapus siswa ini">Hapus</button>
                `;
                container.appendChild(studentRow);
            }
        }

        function removeStudentRow(index) {
            const currentCount = parseInt(document.getElementById('studentCount').value);
            if (currentCount <= 1) {
                alert('Minimal harus ada 1 siswa!');
                return;
            }
            
            document.getElementById('studentCount').value = currentCount - 1;
            updateStudentInputs();
        }

// ===== MUAT DATA CONTOH SISWA =====
        function loadSampleData() {
            const sampleData = [
                { name: "Ahmad Budi Santoso", class: "XII-IPA1", score: 87.5 },
                { name: "Siti Nurhaliza", class: "XII-IPA1", score: 92.8 },
                { name: "Budi Prasetyo", class: "XII-IPS2", score: 78.3 },
                { name: "Dewi Sartika", class: "XII-IPA2", score: 95.7 },
                { name: "Eka Pratama", class: "XII-IPS1", score: 88.9 },
                { name: "Fitri Handayani", class: "XII-IPA1", score: 84.2 },
                { name: "Gunawan Prakoso", class: "XII-IPS2", score: 79.6 },
                { name: "Hani Wulandari", class: "XII-IPA2", score: 91.4 }
            ];

            const count = sampleData.length;
            document.getElementById('studentCount').value = count;
            updateStudentInputs();

    // Mengisi input dengan data contoh
            setTimeout(() => {
                sampleData.forEach((student, index) => {
                    const nameInput = document.getElementById(`name_${index}`);
                    const classInput = document.getElementById(`class_${index}`);
                    const scoreInput = document.getElementById(`score_${index}`);
                    
                    if (nameInput) nameInput.value = student.name;
                    if (classInput) classInput.value = student.class;
                    if (scoreInput) scoreInput.value = student.score;
                });
            }, 100);
        }

// ===== ALGORITMA INSERTION SORT =====
        function insertionSort(data, ascending = false) {
    let sortedData = [...data]; // Membuat salinan agar data asli tidak berubah
            
            for (let i = 1; i < sortedData.length; i++) {
                let key = sortedData[i];
                let j = i - 1;
                
    // Bandingkan berdasarkan nilai
                if (ascending) {
        // Urutan naik (terendah ke tertinggi)
                    while (j >= 0 && sortedData[j].score > key.score) {
                        sortedData[j + 1] = sortedData[j];
                        j = j - 1;
                    }
                } else {
        // Urutan turun (tertinggi ke terendah)
                    while (j >= 0 && sortedData[j].score < key.score) {
                        sortedData[j + 1] = sortedData[j];
                        j = j - 1;
                    }
                }
                
                sortedData[j + 1] = key;
            }
            
            return sortedData;
        }

// ===== PROSES DATA DAN RANKING =====
        function processRanking() {
    // Bersihkan hasil sebelumnya
    studentsData = [];
    document.getElementById('resultsSection').classList.add('hidden');

    // Ambil jumlah siswa
    const count = parseInt(document.getElementById('studentCount').value);

    // Ambil dan validasi data siswa
    for (let i = 0; i < count; i++) {
        const nameElement = document.getElementById(`name_${i}`);
        const classElement = document.getElementById(`class_${i}`);
        const scoreElement = document.getElementById(`score_${i}`);

        if (!nameElement || !classElement || !scoreElement) {
            continue; // Lewati jika elemen tidak ada
        }

        const name = nameElement.value.trim();
        const studentClass = classElement.value.trim();
        const score = parseFloat(scoreElement.value);

        // Validasi data
        if (!name) {
            alert(`Nama siswa ke-${i + 1} tidak boleh kosong!`);
            nameElement.focus();
            return;
        }
        if (!studentClass) {
            alert(`Kelas siswa ke-${i + 1} tidak boleh kosong!`);
            classElement.focus();
            return;
        }
        if (isNaN(score) || score < 0 || score > 100) {
            alert(`Nilai siswa ke-${i + 1} harus berupa angka antara 0-100!`);
            scoreElement.focus();
            return;
        }

        studentsData.push({
            name: name,
            class: studentClass,
            score: score
        });
    }

    if (studentsData.length === 0) {
        alert('Tidak ada data siswa yang valid!');
        return;
    }

    // Ambil urutan pengurutan
    const sortOrder = document.getElementById('sortOrder').value;
    const ascending = sortOrder === 'asc';

    // Urutkan data menggunakan insertion sort
    sortedStudents = insertionSort(studentsData, ascending);

    // Tampilkan hasil ranking dan statistik
    displayRankingTable();
    displayStatistics();

    // Tampilkan bagian hasil
    document.getElementById('resultsSection').classList.remove('hidden');

    // Bersihkan hasil pencarian
    clearSearch();
        }

// ===== FUNGSI TAMPILAN HASIL =====
        function displayRankingTable() {
            const tbody = document.getElementById('rankingTableBody');
            tbody.innerHTML = '';

            let currentRank = 1;
            
            sortedStudents.forEach((student, index) => {
                const row = document.createElement('tr');
                
    // Penanganan peringkat yang sama (nilai sama)
                if (index > 0 && sortedStudents[index - 1].score === student.score) {
                // Peringkat sama dengan siswa sebelumnya
                    row.innerHTML = `
                        <td><span class="rank-badge">=</span></td>
                        <td>${student.name}</td>
                        <td>${student.class}</td>
                        <td>${student.score.toFixed(2)}</td>
                    `;
                } else {
                // Peringkat baru
                    currentRank = index + 1;
                    let rankClass = '';
                    
                // Gaya khusus untuk 3 peringkat teratas
                    if (currentRank === 1) rankClass = 'gold';
                    else if (currentRank === 2) rankClass = 'silver';
                    else if (currentRank === 3) rankClass = 'bronze';
                    
                    row.innerHTML = `
                        <td><span class="rank-badge ${rankClass}">${currentRank}</span></td>
                        <td>${student.name}</td>
                        <td>${student.class}</td>
                        <td>${student.score.toFixed(2)}</td>
                    `;
                }
                
                tbody.appendChild(row);
            });
        }

        function displayStatistics() {
            const scores = studentsData.map(student => student.score);
            
            const totalStudents = scores.length;
            const avgScore = scores.reduce((sum, score) => sum + score, 0) / totalStudents;
            const maxScore = Math.max(...scores);
            const minScore = Math.min(...scores);

            document.getElementById('totalStudents').textContent = totalStudents;
            document.getElementById('avgScore').textContent = avgScore.toFixed(2);
            document.getElementById('maxScore').textContent = maxScore.toFixed(2);
            document.getElementById('minScore').textContent = minScore.toFixed(2);
        }

// ===== FUNGSI PENCARIAN SISWA =====
        function searchStudent() {
            const searchName = document.getElementById('searchName').value.trim().toLowerCase();
            const resultDiv = document.getElementById('searchResult');
            
            if (!searchName) {
                resultDiv.innerHTML = '<div class="search-result not-found">Mohon masukkan nama siswa yang ingin dicari!</div>';
                return;
            }

            if (sortedStudents.length === 0) {
                resultDiv.innerHTML = '<div class="search-result not-found">Silakan proses ranking terlebih dahulu!</div>';
                return;
            }

    // Cari siswa di array yang sudah diurutkan
            let foundIndex = -1;
            for (let i = 0; i < sortedStudents.length; i++) {
                if (sortedStudents[i].name.toLowerCase().includes(searchName)) {
                    foundIndex = i;
                    break;
                }
            }

            if (foundIndex !== -1) {
                const student = sortedStudents[foundIndex];
                
            // Hitung peringkat sebenarnya (jika ada nilai sama)
                let rank = foundIndex + 1;
                for (let i = foundIndex - 1; i >= 0; i--) {
                    if (sortedStudents[i].score === student.score) {
                        rank = i + 1;
                    } else {
                        break;
                    }
                }

                resultDiv.innerHTML = `
                    <div class="search-result found">
                        <strong>✅ Siswa Ditemukan!</strong><br>
                        <strong>Nama:</strong> ${student.name}<br>
                        <strong>Kelas:</strong> ${student.class}<br>
                        <strong>Nilai:</strong> ${student.score.toFixed(2)}<br>
                        <strong>Peringkat:</strong> ${rank} dari ${sortedStudents.length} siswa
                    </div>
                `;
            } else {
                resultDiv.innerHTML = '<div class="search-result not-found">❌ Siswa tidak ditemukan dalam data!</div>';
            }
        }

        function clearSearch() {
            document.getElementById('searchName').value = '';
            document.getElementById('searchResult').innerHTML = '';
        }

// ===== FUNGSI UTILITAS =====
        function formatNumber(num) {
            return num.toFixed(2);
        }

// Otomatis muat data contoh untuk demo
        setTimeout(() => {
            loadSampleData();
        }, 500);
