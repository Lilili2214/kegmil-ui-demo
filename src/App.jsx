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

const MAIN_NAV = [
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

const TABLE_COLUMNS = [
  ['ITEM NAME', 'itemName'],
  ['ITEM ID', 'itemId'],
  ['ITEM CATEGORY', 'itemCategory'],
  ['STATUS', 'status'],
  ['UNIT OF MEASURE', 'unitOfMeasure'],
];

function App() {
  const [globalSearch, setGlobalSearch] = useState('10010820');
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('itemName');
  const [sortOrder, setSortOrder] = useState('asc');

  const itemsPerPage = 10;

  const filteredItems = useMemo(() => {
    const globalTerm = globalSearch.trim().toLowerCase();
    const tableTerm = tableSearch.trim().toLowerCase();

    return ITEMS.filter((item) => {
      const inGlobal =
        globalTerm.length === 0 ||
        item.itemId.toLowerCase().includes(globalTerm) ||
        item.itemName.toLowerCase().includes(globalTerm);

      const inTable =
        tableTerm.length === 0 ||
        item.itemName.toLowerCase().includes(tableTerm) ||
        item.itemId.toLowerCase().includes(tableTerm);

      const inStatus = statusFilter === 'All' || item.status === statusFilter;

      return inGlobal && inTable && inStatus;
    });
  }, [globalSearch, tableSearch, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((left, right) => {
      const a = left[sortBy];
      const b = right[sortBy];
      if (typeof a !== 'string' || typeof b !== 'string') return 0;
      return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    });
  }, [filteredItems, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedItems.slice(start, start + itemsPerPage);
  }, [currentPage, sortedItems]);

  const from = sortedItems.length ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const to = Math.min(currentPage * itemsPerPage, sortedItems.length);

  const onSort = (column) => {
    if (column === sortBy) {
      setSortOrder((value) => (value === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortOrder('asc');
  };

  return (
    <div className="flex min-h-screen bg-[#f2f3f5] text-[#1f2937]">
      <aside className="w-60 shrink-0 bg-[#00274f] text-white">
        <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
          <span className="text-4xl font-bold leading-none">K</span>
          <span className="text-3xl font-semibold">Kegmil</span>
        </div>

        <nav className="py-4 text-[18px]">
          {MAIN_NAV.map((label) => {
            const isItemCatalog = label === 'Item Catalog';

            return (
              <div key={label}>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-white/90 hover:bg-white/10 ${
                    isItemCatalog ? 'bg-black/25' : ''
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-xs text-white/70">▾</span>
                </button>

                {isItemCatalog && (
                  <div className="bg-black/30 text-[17px]">
                    <div className="px-8 py-3 text-white/75">Item Category</div>
                    <div className="bg-[#0f55c8] px-8 py-3 text-white">Items</div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-[#d6d9df] bg-white px-6">
          <h1 className="text-[42px] font-semibold leading-none text-[#0f172a]">Items</h1>

          <div className="flex items-center gap-4">
            <div className="flex h-9 items-center overflow-hidden rounded border border-slate-300 bg-white">
              <select className="h-full border-r border-slate-200 px-3 text-sm text-slate-600 outline-none">
                <option>All</option>
              </select>
              <span className="pl-3 text-slate-400">⌕</span>
              <input
                value={globalSearch}
                onChange={(event) => {
                  setCurrentPage(1);
                  setGlobalSearch(event.target.value);
                }}
                className="h-full w-56 px-2 text-sm outline-none"
              />
              <button type="button" className="px-3 text-slate-400" onClick={() => setGlobalSearch('')}>
                ✕
              </button>
            </div>

            <button type="button" className="text-2xl text-slate-600">＋</button>

            <div className="relative">
              <button type="button" className="text-xl text-slate-600">🔔</button>
              <span className="absolute -right-3 -top-3 rounded-full bg-[#ff5a5a] px-1.5 py-0.5 text-[10px] text-white">99+</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-200" />
              <span className="text-sm text-slate-700">Suzi Tan</span>
            </div>
          </div>
        </header>

        <section className="p-5">
          <div className="border border-[#d8dbe2] bg-[#f7f8fa] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button type="button" className="h-9 rounded border border-slate-300 bg-white px-3 text-slate-500">⚲</button>

                <div className="flex h-9 items-center rounded border border-slate-300 bg-white px-3 text-slate-400">
                  <span>⌕</span>
                  <input
                    value={tableSearch}
                    onChange={(event) => {
                      setCurrentPage(1);
                      setTableSearch(event.target.value);
                    }}
                    className="ml-2 w-64 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
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

            <div className="overflow-auto border border-[#e1e5eb] bg-white">
              <table className="min-w-[1100px] text-left text-sm">
                <thead className="bg-[#f4f5f7] text-[#0f172a]">
                  <tr>
                    {TABLE_COLUMNS.map(([title, key]) => (
                      <th key={title} className="border-r border-[#e0e4ea] px-5 py-4 font-semibold last:border-r-0">
                        <button type="button" className="flex w-full items-center justify-between" onClick={() => onSort(key)}>
                          <span>{title}</span>
                          <span className="text-slate-400">{sortBy === key ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </button>
                      </th>
                    ))}
                    <th className="px-5 py-4 font-semibold">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedItems.map((item) => (
                    <tr key={item.id} className="border-t border-[#edf0f4]">
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
                {from}-{to} of {sortedItems.length} items
              </span>

              <button
                type="button"
                className="h-9 w-9 rounded border border-slate-300 bg-white text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <button type="button" className="h-9 w-9 rounded bg-[#0f55c8] text-white">
                {currentPage}
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded border border-slate-300 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>

              <span>{itemsPerPage} / page</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
