import { useMemo, useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: '▦' },
  { label: 'Clients', icon: '▣' },
  { label: 'Assets', icon: '◈' },
  { label: 'Job', icon: '⚒', hasChevron: true },
  { label: 'Statistical Reports', icon: '▤', hasChevron: true },
  { label: 'Administration', icon: '◉', hasChevron: true },
  {
    label: 'Item Catalog',
    icon: '⚑',
    hasChevron: true,
    active: true,
    children: [
      { label: 'Item Category' },
      { label: 'Items', active: true },
    ],
  },
  { label: 'Time Reporting', icon: '◷', hasChevron: true },
  { label: 'Configuration', icon: '⚙', hasChevron: true },
];

const items = [
  ['"PSU-PG-P-24-33V/13A "', 'XX00331', 'Others', 'Active', 'EA'],
  ['"S" landing door key', 'HMSS018', 'Schedule of rates', 'Active', 'PC'],
  ['"TAPE-2"" MASKING TAPE TIP-210 "', 'XX00390', 'Others', 'Active', 'EA'],
  ['"Triangle" landing door key', 'HMSS019', 'Schedule of rates', 'Active', 'PC'],
  ['"VACUUM BAG - Electrolux" Model "', 'XX00489', 'Others', 'Active', 'EA'],
  ['"VVVF Inverter Unit (17th', 'XX00501', 'Schedule of rates', 'Active', 'EA'],
  ['"LED Strip Light - 5m"', 'XX00622', 'Others', 'Inactive', 'PC'],
  ['"Emergency Exit Sign"', 'HMSS025', 'Schedule of rates', 'Active', 'EA'],
  ['"Fire Extinguisher - 5kg"', 'XX00788', 'Others', 'Active', 'PC'],
  ['"Smoke Detector - Ceiling Mount"', 'HMSS033', 'Schedule of rates', 'Active', 'EA'],
].map(([itemName, itemId, itemCategory, status, unitOfMeasure], index) => ({
  id: index + 1,
  itemName,
  itemId,
  itemCategory,
  status,
  unitOfMeasure,
}));

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchSearch =
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.itemId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [searchTerm, statusFilter],
  );

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-slate-800">
      <aside className="w-60 shrink-0 bg-[#002347] text-white">
        <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
          <div className="text-4xl font-bold leading-none">K</div>
          <div className="text-[40px] leading-none">|</div>
          <p className="text-4xl font-semibold tracking-wide">Kegmil</p>
        </div>

        <nav className="py-4 text-[32px] leading-none">
          {navItems.map((item) => (
            <div key={item.label}>
              <div
                className={`flex items-center justify-between px-4 py-4 transition ${
                  item.active ? 'bg-black/20' : 'hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 text-center text-[24px] text-white/80">{item.icon}</span>
                  <span className="text-white/90">{item.label}</span>
                </div>
                {item.hasChevron && <span className="text-white/70">⌄</span>}
              </div>

              {item.children && (
                <div className="bg-black/30 text-[32px]">
                  {item.children.map((child) => (
                    <div
                      key={child.label}
                      className={`px-8 py-4 ${
                        child.active ? 'bg-[#0f55c8] text-white' : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-[54px] font-semibold leading-none text-[#101828]">Items</h1>
          <div className="flex items-center gap-4 text-[32px] text-slate-700">
            <div className="flex h-9 items-center overflow-hidden rounded border border-slate-300 bg-white">
              <select className="h-full border-r border-slate-200 px-4 text-base text-slate-600 outline-none">
                <option>All</option>
              </select>
              <div className="relative flex h-full items-center">
                <span className="pl-3 text-slate-400">⌕</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="10010820"
                  className="h-full w-64 px-3 text-base outline-none"
                />
                <button className="px-3 text-slate-400">✕</button>
              </div>
            </div>
            <button className="text-4xl">＋</button>
            <button className="text-3xl">🔔</button>
            <div className="flex items-center gap-2 text-xl">
              <div className="h-7 w-7 rounded-full bg-slate-200" />
              <span>Suzi Tan</span>
            </div>
          </div>
        </header>

        <section className="p-5">
          <div className="rounded-sm border border-slate-200 bg-[#f6f7f9] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button className="h-9 rounded border border-slate-300 bg-white px-3 text-slate-500">⏷</button>
                <div className="flex h-9 items-center rounded border border-slate-300 bg-white px-3 text-slate-400">
                  ⌕
                  <input
                    className="ml-2 w-56 text-base text-slate-700 placeholder:text-slate-400 outline-none"
                    placeholder="Search by Item Name, ..."
                  />
                </div>
                <select
                  className="h-9 rounded border border-slate-300 bg-white px-3 text-base text-slate-600"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button className="h-9 rounded border border-slate-300 bg-white px-3 text-slate-500">⊞</button>
            </div>

            <div className="overflow-auto rounded-sm border border-slate-200 bg-white">
              <table className="min-w-[980px] text-left text-xl">
                <thead className="bg-[#f4f5f7] text-[#111827]">
                  <tr>
                    {['ITEM NAME', 'ITEM ID', 'ITEM CATEGORY', 'STATUS', 'UNIT OF MEASURE', 'ACTION'].map((header) => (
                      <th key={header} className="whitespace-nowrap border-r border-slate-200 px-5 py-4 font-semibold last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
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

            <div className="mt-4 flex items-center justify-end gap-3 text-xl text-slate-600">
              <span>1-10 of 7067 items</span>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded border border-slate-300 bg-white text-slate-400">‹</button>
                <button className="h-9 w-9 rounded bg-[#0f55c8] text-white">1</button>
                <button className="h-9 w-9 rounded border border-slate-300 bg-white">2</button>
                <button className="h-9 w-9 rounded border border-slate-300 bg-white">3</button>
                <span>…</span>
                <button className="h-9 w-12 rounded border border-slate-300 bg-white">707</button>
                <button className="h-9 w-9 rounded border border-slate-300 bg-white">›</button>
              </div>
              <span>10 / page</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
