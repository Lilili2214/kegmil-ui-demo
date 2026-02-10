import { useMemo, useState } from 'react';

const mockHistory = [
  {
    id: 'IMP-2026-001',
    type: 'Image',
    mappingFile: 'item-image-mapping-jan.csv',
    zipFile: 'images-jan.zip',
    date: '2026-02-10 09:12',
    user: 'Suzi Tan',
    successCount: 9,
    failedCount: 3,
    status: 'Completed',
    mappingContent: 'itemCode,fileName\nXX00331,psu-24v.jpg',
    zipContent: 'Mock ZIP content: images for January import',
    resultRows: null
  },
  {
    id: 'IMP-2026-002',
    type: 'Attachment',
    mappingFile: 'attachment-mapping-feb.xlsx',
    zipFile: 'attachments-feb.zip',
    date: '2026-02-10 10:03',
    user: 'Suzi Tan',
    successCount: 12,
    failedCount: 0,
    status: 'Completed',
    mappingContent: 'itemCode,fileName\nHMSS018,door-key-manual.pdf',
    zipContent: 'Mock ZIP content: attachments for February import',
    resultRows: null
  }
];

const makeResultRows = () => [
  { row: 1, itemCode: 'XX00331', itemName: 'PSU-PG-P-24-33V/13A', fileName: 'psu-24v.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 2, itemCode: 'HMSS018', itemName: 'S landing door key', fileName: 's-key.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 3, itemCode: 'XX00390', itemName: 'TAPE-2 MASKING TAPE TIP-210', fileName: 'masking-tape.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 4, itemCode: 'HMSS019', itemName: 'Triangle landing door key', fileName: 'triangle-key.jpg', status: 'Failed', details: 'Filename not found in ZIP' },
  { row: 5, itemCode: 'XX00489', itemName: 'VACUUM BAG - Electrolux', fileName: 'vacuum-bag.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 6, itemCode: 'XX00501', itemName: 'VVVF Inverter Unit', fileName: 'inverter-unit.jpg', status: 'Failed', details: 'Item code does not exist' },
  { row: 7, itemCode: 'XX00622', itemName: 'LED Strip Light - 5m', fileName: 'led-strip.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 8, itemCode: 'HMSS025', itemName: 'Emergency Exit Sign', fileName: 'exit-sign.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 9, itemCode: 'XX00788', itemName: 'Fire Extinguisher - 5kg', fileName: 'extinguisher.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 10, itemCode: 'HMSS033', itemName: 'Smoke Detector - Ceiling Mount', fileName: 'smoke-detector.jpg', status: 'Success', details: 'Imported successfully' },
  { row: 11, itemCode: 'XX00811', itemName: 'Door Motor 3HP', fileName: 'door-motor.jpg', status: 'Failed', details: 'Unsupported file extension in ZIP' },
  { row: 12, itemCode: 'XX00815', itemName: 'Control Board v2', fileName: 'control-board.jpg', status: 'Success', details: 'Imported successfully' }
];

const downloadBlob = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const TypeBadge = ({ type }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${type === 'Image' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'}`}>
    {type}
  </span>
);

function App() {
  const [historyRows, setHistoryRows] = useState(mockHistory);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [importType, setImportType] = useState('');
  const [mappingFile, setMappingFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [activeImport, setActiveImport] = useState(null);
  const [resultFilter, setResultFilter] = useState('All');
  const [notice, setNotice] = useState('');

  const canUpload = Boolean(importType && mappingFile && zipFile);

  const visibleResultRows = useMemo(() => {
    if (!activeImport) return [];
    if (resultFilter === 'All') return activeImport.resultRows;
    return activeImport.resultRows.filter((row) => row.status === resultFilter);
  }, [activeImport, resultFilter]);

  const resultCounts = useMemo(() => {
    if (!activeImport) return { all: 0, success: 0, failed: 0 };
    const success = activeImport.resultRows.filter((row) => row.status === 'Success').length;
    const failed = activeImport.resultRows.filter((row) => row.status === 'Failed').length;
    return { all: activeImport.resultRows.length, success, failed };
  }, [activeImport]);

  const openNewImport = () => {
    setImportType('');
    setMappingFile(null);
    setZipFile(null);
    setShowImportPopup(true);
  };

  const submitImport = () => {
    if (!canUpload) return;

    const newId = `IMP-2026-${String(historyRows.length + 1).padStart(3, '0')}`;
    const queued = {
      id: newId,
      type: importType,
      mappingFile: mappingFile.name,
      zipFile: zipFile.name,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      user: 'Suzi Tan',
      successCount: '-',
      failedCount: '-',
      status: 'Processing',
      mappingContent: 'Uploaded mapping file',
      zipContent: 'Uploaded ZIP file',
      resultRows: null
    };

    setHistoryRows((prev) => [queued, ...prev]);
    setShowImportPopup(false);
    setNotice(`Import ${newId} đã được đưa vào hàng đợi. Dữ liệu lớn có thể mất vài phút để xử lý.`);

    window.setTimeout(() => {
      const rows = makeResultRows();
      const successCount = rows.filter((r) => r.status === 'Success').length;
      const failedCount = rows.filter((r) => r.status === 'Failed').length;
      setHistoryRows((prev) =>
        prev.map((entry) =>
          entry.id === newId
            ? { ...entry, status: 'Completed', successCount, failedCount, resultRows: rows }
            : entry
        )
      );
      setNotice(`Import ${newId} xử lý xong. Bạn có thể bấm "View Result" để xem chi tiết.`);
    }, 5000);
  };

  const openResult = (row) => {
    if (row.status !== 'Completed') return;

    const detailedImport = {
      ...row,
      mappingFile: { name: row.mappingFile, content: row.mappingContent },
      zipFile: { name: row.zipFile, content: row.zipContent },
      resultRows: row.resultRows ?? makeResultRows()
    };

    setResultFilter('All');
    setActiveImport(detailedImport);
  };

  const exportResults = () => {
    if (!activeImport) return;
    const header = 'row,itemCode,itemName,fileName,status,details';
    const lines = activeImport.resultRows.map((r) => `${r.row},${r.itemCode},"${r.itemName}",${r.fileName},${r.status},"${r.details}"`);
    downloadBlob([header, ...lines].join('\n'), `${activeImport.id}-result.csv`, 'text/csv;charset=utf-8');
  };

  return (
    <div className="flex h-screen bg-[#f3f5f7] text-[#111827]">
      <aside className="w-64 shrink-0 bg-[#001a3a] text-white">
        <div className="flex h-14 items-center gap-3 border-b border-[#13355f] px-4">
          <div className="text-3xl font-bold">K</div>
          <div className="text-2xl font-semibold">Kegmil</div>
        </div>
        <nav className="space-y-1 py-4 text-sm">
          {['Dashboard', 'Clients', 'Assets', 'Job', 'Statistical Reports', 'Administration'].map((item) => (
            <div key={item} className="px-4 py-2 text-[#b6c3d8]">{item}</div>
          ))}
          <div className="px-4 py-2 text-[#b6c3d8]">Item Catalog</div>
          <div className="px-9 py-2 text-[#b6c3d8]">Item Category</div>
          <div className="px-9 py-2 text-[#b6c3d8]">Items</div>
          <div className="bg-[#0f57c5] px-9 py-2 font-medium text-white">Import</div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="flex h-14 items-center justify-between border-b border-[#e4e7ec] bg-white px-6">
          <h1 className="text-2xl font-semibold">Import</h1>
          <span className="text-sm text-[#475467]">Suzi Tan</span>
        </header>

        <div className="p-6">
          {notice && (
            <div className="mb-4 rounded border border-[#b2ccff] bg-[#eef4ff] px-4 py-3 text-sm text-[#1d4ed8]">
              {notice}
            </div>
          )}

          {!activeImport && (
            <section className="rounded-lg border border-[#e4e7ec] bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Import History</h2>
                <button onClick={openNewImport} className="rounded-md bg-[#0f57c5] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d4cae]">
                  + New Import
                </button>
              </div>
              <p className="mb-4 text-xs text-[#667085]">Lưu ý: import dữ liệu lớn được xử lý bất đồng bộ ở background, kết quả có thể chưa có ngay.</p>

              <div className="overflow-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-[#f8fafc] text-[#475467]">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Mapping File</th>
                      <th className="px-4 py-3">ZIP File</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Success / Failed</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((row) => (
                      <tr key={row.id} className="border-t border-[#eaecf0] hover:bg-[#f9fafb]">
                        <td className="px-4 py-3 font-medium text-[#0f57c5]">{row.id}</td>
                        <td className="px-4 py-3"><TypeBadge type={row.type} /></td>
                        <td className="px-4 py-3">{row.mappingFile}</td>
                        <td className="px-4 py-3">{row.zipFile}</td>
                        <td className="px-4 py-3">{row.date}</td>
                        <td className="px-4 py-3">{row.user}</td>
                        <td className="px-4 py-3">{row.successCount} / {row.failedCount}</td>
                        <td className="px-4 py-3">
                          <span className={row.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            disabled={row.status !== 'Completed'}
                            onClick={() => openResult(row)}
                            className={`rounded border px-3 py-1 ${row.status === 'Completed' ? 'border-[#d0d5dd] text-[#344054]' : 'cursor-not-allowed border-[#eaecf0] text-[#98a2b3]'}`}
                          >
                            View Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeImport && (
            <section className="rounded-lg border border-[#e4e7ec] bg-white p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-lg font-semibold">Import Result</h2>
                    <TypeBadge type={activeImport.type} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <button
                      onClick={() => downloadBlob(activeImport.mappingFile.content, activeImport.mappingFile.name, 'text/plain;charset=utf-8')}
                      className="text-[#0f57c5] hover:underline"
                    >
                      Download Mapping File
                    </button>
                    <button
                      onClick={() => downloadBlob(activeImport.zipFile.content, activeImport.zipFile.name, 'application/zip')}
                      className="text-[#0f57c5] hover:underline"
                    >
                      Download ZIP File
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  {[
                    { key: 'All', label: `All (${resultCounts.all})` },
                    { key: 'Success', label: `Success (${resultCounts.success})` },
                    { key: 'Failed', label: `Failed (${resultCounts.failed})` }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setResultFilter(tab.key)}
                      className={`rounded-md border px-3 py-1.5 text-sm ${resultFilter === tab.key ? 'border-[#0f57c5] bg-[#eef4ff] text-[#0f57c5]' : 'border-[#d0d5dd] text-[#344054]'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <button onClick={exportResults} className="rounded-md border border-[#d0d5dd] px-3 py-1.5 text-sm text-[#344054]">Export</button>
                  <button onClick={() => setActiveImport(null)} className="rounded-md border border-[#d0d5dd] px-3 py-1.5 text-sm text-[#344054]">Back</button>
                </div>
              </div>

              <div className="overflow-auto">
                <table className="w-full min-w-[1100px] text-left text-sm">
                  <thead className="bg-[#f8fafc] text-[#475467]">
                    <tr>
                      <th className="px-4 py-3">Row #</th>
                      <th className="px-4 py-3">Item Code</th>
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3">Filename</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleResultRows.map((row) => (
                      <tr key={row.row} className={`border-t border-[#eaecf0] ${row.status === 'Failed' ? 'bg-red-50' : ''}`}>
                        <td className="px-4 py-3">{row.row}</td>
                        <td className="px-4 py-3">{row.itemCode}</td>
                        <td className="px-4 py-3">{row.itemName}</td>
                        <td className="px-4 py-3">{row.fileName}</td>
                        <td className="px-4 py-3">
                          <span className={row.status === 'Success' ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                            {row.status === 'Success' ? '✓ Success' : '✗ Failed'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{row.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      {showImportPopup && (
        <>
          <div className="fixed inset-0 z-20 bg-black/25" onClick={() => setShowImportPopup(false)} />
          <section className="fixed left-1/2 top-1/2 z-30 w-[min(920px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#d0d5dd] bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">New Import</h3>
              <button onClick={() => setShowImportPopup(false)} className="rounded border border-[#d0d5dd] px-3 py-1 text-sm text-[#344054]">Close</button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium">Import Type <span className="text-red-500">*</span></p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="importType" value="Image" checked={importType === 'Image'} onChange={(e) => setImportType(e.target.value)} />
                    Image
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="importType" value="Attachment" checked={importType === 'Attachment'} onChange={(e) => setImportType(e.target.value)} />
                    Attachment
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium">Mapping File (CSV / Excel) <span className="text-red-500">*</span></p>
                    <button type="button" onClick={() => downloadBlob('itemCode,fileName\nXX00331,psu-24v.jpg', 'import-template.csv', 'text/csv;charset=utf-8')} className="text-sm text-[#0f57c5] hover:underline">
                      Download template
                    </button>
                  </div>
                  <label htmlFor="mapping-file" className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-[#98a2b3] bg-[#f8fafc] px-4 py-3 text-sm">
                    <span>{mappingFile ? mappingFile.name : 'Click to select mapping file'}</span>
                    <span className="rounded border border-[#d0d5dd] px-3 py-1">Browse</span>
                  </label>
                  <input id="mapping-file" type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={(e) => setMappingFile(e.target.files?.[0] || null)} />
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium">ZIP File (images / attachments) <span className="text-red-500">*</span></p>
                  <label htmlFor="zip-file" className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-[#98a2b3] bg-[#f8fafc] px-4 py-3 text-sm">
                    <span>{zipFile ? zipFile.name : 'Click to select ZIP file'}</span>
                    <span className="rounded border border-[#d0d5dd] px-3 py-1">Browse</span>
                  </label>
                  <input id="zip-file" type="file" accept=".zip" className="hidden" onChange={(e) => setZipFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              <button
                onClick={submitImport}
                disabled={!canUpload}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white ${canUpload ? 'bg-[#0f57c5] hover:bg-[#0d4cae]' : 'cursor-not-allowed bg-[#98a2b3]'}`}
              >
                Upload & Import
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
