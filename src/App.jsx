import { useMemo, useState } from 'react';

const ITEMS = [
  { id: 1, itemName: '"PSU-PG-P-24-33V/13A "', itemId: 'XX00331', itemCategory: 'Others', status: 'Active', unitOfMeasure: 'EA' },
  { id: 2, itemName: '"S" landing door key', itemId: 'HMSS018', itemCategory: 'Schedule of rates', status: 'Active', unitOfMeasure: 'PC' },
  { id: 3, itemName: '"TAPE-2" MASKING TAPE TIP-210 "', itemId: 'XX00390', itemCategory: 'Others', status: 'Active', unitOfMeasure: 'EA' },
  { id: 4, itemName: '"Triangle" landing door key', itemId: 'HMSS019', itemCategory: 'Schedule of rates', status: 'Active', unitOfMeasure: 'PC' },
  { id: 5, itemName: '"VACUUM BAG - Electrolux" Model "', itemId: 'XX00489', itemCategory: 'Others', status: 'Active', unitOfMeasure: 'EA' },
  { id: 6, itemName: '"VVVF Inverter Unit (17th"', itemId: 'XX00501', itemCategory: 'Schedule of rates', status: 'Active', unitOfMeasure: 'EA' },
  { id: 7, itemName: '"LED Strip Light - 5m"', itemId: 'XX00622', itemCategory: 'Others', status: 'Inactive', unitOfMeasure: 'PC' },
  { id: 8, itemName: '"Emergency Exit Sign"', itemId: 'HMSS025', itemCategory: 'Schedule of rates', status: 'Active', unitOfMeasure: 'EA' },
  { id: 9, itemName: '"Fire Extinguisher - 5kg"', itemId: 'XX00788', itemCategory: 'Others', status: 'Active', unitOfMeasure: 'PC' },
  { id: 10, itemName: '"Smoke Detector - Ceiling Mount"', itemId: 'HMSS033', itemCategory: 'Schedule of rates', status: 'Active', unitOfMeasure: 'EA' },
];

const NAV_ITEMS = [
  'Dashboard',
  'Clients',
  'Assets',
  'Job',
  'Statistical Reports',
  'Administration',
  'Item Catalog',
  'Time Reporting',
  'Configuration',
];

const sortArrow = {
  asc: '↑',
  desc: '↓',
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('itemName');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredItems = useMemo(() => {
    const loweredTop = searchTerm.toLowerCase();
    const loweredTable = tableSearch.toLowerCase();

    return ITEMS.filter((item) => {
      const matchTopSearch =
        item.itemName.toLowerCase().includes(loweredTop) ||
        item.itemId.toLowerCase().includes(loweredTop);
      const matchTableSearch =
        item.itemName.toLowerCase().includes(loweredTable) ||
        item.itemId.toLowerCase().includes(loweredTable);
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchTopSearch && matchTableSearch && matchStatus;
    });
  }, [searchTerm, tableSearch, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const left = a[sortBy];
      const right = b[sortBy];

      if (typeof left === 'string' && typeof right === 'string') {
        return sortOrder === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
      }

      return 0;
    });
  }, [filteredItems, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(start, start + itemsPerPage);
  }, [sortedItems, currentPage, itemsPerPage]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((previous) => (previous === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortOrder('asc');
  };

  const showingFrom = sortedItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, sortedItems.length);

  return (
    <div className="flex min-h-screen bg-[#f1f3f6] text-[#1e293b]">
      <aside className="w-60 shrink-0 bg-[#00254a] text-white">
        <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
          <span className="text-3xl font-bold">K</span>
          <span className="text-3xl font-semibold tracking-wide">Kegmil</span>
        </div>

        <nav className="pt-5 text-[30px]">
          {NAV_ITEMS.map((label) => {
            const isCatalog = label === 'Item Catalog';
            return (
              <div key={label}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-white/90 hover:bg-white/10 ${
                    isCatalog ? 'bg-black/25' : ''
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-white/70">⌄</span>
                </button>

                {isCatalog && (
                  <div className="bg-black/35">
                    <div className="px-8 py-3 text-white/80">Item Category</div>
                    <div className="bg-[#0f55c8] px-8 py-3 text-white">Items</div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-2xl font-semibold text-[#0f172a]">Items</h1>
          <div className="flex items-center gap-3">
            <div className="flex h-9 items-center overflow-hidden rounded border border-slate-300">
              <select className="h-full border-r border-slate-200 px-3 text-sm text-slate-600 outline-none">
                <option>All</option>
              </select>
              <span className="pl-3 text-slate-400">⌕</span>
              <input
                value={searchTerm}
                onChange={(event) => {
                  setCurrentPage(1);
                  setSearchTerm(event.target.value);
                }}
                placeholder="10010820"
                className="h-full w-56 px-2 text-sm outline-none"
              />
              <button type="button" className="px-3 text-slate-400" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            </div>
            <button type="button" className="text-xl text-slate-600">＋</button>
            <button type="button" className="text-lg text-slate-600">🔔</button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-200" />
              <span className="text-sm text-slate-700">Suzi Tan</span>
            </div>
          </div>
        </header>

        <section className="p-5">
          <div className="rounded-sm border border-slate-200 bg-[#f7f8fa] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button type="button" className="h-9 rounded border border-slate-300 bg-white px-3 text-slate-500">⚲</button>
                <div className="flex h-9 items-center rounded border border-slate-300 bg-white px-3 text-slate-400">
                  ⌕
                  <input
                    value={tableSearch}
                    onChange={(event) => {
                      setCurrentPage(1);
                      setTableSearch(event.target.value);
                    }}
                    className="ml-2 w-60 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                    placeholder="Search by Item Name, ..."
                  />
                </div>
                <select
                  className="h-9 rounded border border-slate-300 bg-white px-3 text-sm text-slate-600"
                  value={statusFilter}
                  onChange={(event) => {
                    setCurrentPage(1);
                    setStatusFilter(event.target.value);
                  }}
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button type="button" className="h-9 rounded border border-slate-300 bg-white px-3 text-slate-500">⊞</button>
            </div>

            <div className="overflow-auto rounded-sm border border-slate-200 bg-white">
              <table className="min-w-[1080px] text-left text-base">
                <thead className="bg-[#f4f5f7] text-[#111827]">
                  <tr>
                    {[
                      ['ITEM NAME', 'itemName'],
                      ['ITEM ID', 'itemId'],
                      ['ITEM CATEGORY', 'itemCategory'],
                      ['STATUS', 'status'],
                      ['UNIT OF MEASURE', 'unitOfMeasure'],
                    ].map(([header, key]) => (
                      <th
                        key={header}
                        className="whitespace-nowrap border-r border-slate-200 px-5 py-4 font-semibold last:border-r-0"
                      >
                        <button type="button" className="flex w-full items-center justify-between" onClick={() => handleSort(key)}>
                          <span>{header}</span>
                          <span className="ml-2 text-slate-400">{sortBy === key ? sortArrow[sortOrder] : '↕'}</span>
                        </button>
                      </th>
                    ))}
                    <th className="whitespace-nowrap px-5 py-4 font-semibold">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedItems.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-5 py-4 font-semibold text-[#0b4fb8]">{item.itemName}</td>
                      <td className="px-5 py-4">{item.itemId}</td>
                      <td className="px-5 py-4">{item.itemCategory}</td>
                      <td className="px-5 py-4">{item.status}</td>
                      <td className="px-5 py-4">{item.unitOfMeasure}</td>
                      <td className="px-5 py-4 text-slate-400">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 text-sm text-slate-600">
              <span>
                {showingFrom}-{showingTo} of {sortedItems.length} items
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded border border-slate-300 bg-white text-slate-500 disabled:cursor-not-allowed disabled:text-slate-300"
                  onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                <button type="button" className="h-9 w-9 rounded bg-[#0f55c8] text-white">
                  {currentPage}
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded border border-slate-300 bg-white text-slate-500 disabled:cursor-not-allowed disabled:text-slate-300"
                  onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
              <span>{itemsPerPage} / page</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
