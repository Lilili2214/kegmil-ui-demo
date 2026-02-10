import { useMemo, useState } from 'react';

const navSections = [
  'Dashboard',
  'Clients',
  'Assets',
  'Job',
  'Statistical Reports',
  'Administration',
  'Item Catalog',
  'Time Reporting',
  'Configuration'
];

const itemsData = [
  {
    id: 1,
    itemName: '"PSU-PG-P-24-33V/13A "',
    itemId: 'XX00331',
    itemCategory: 'Others',
    status: 'Active',
    unitOfMeasure: 'EA',
    usage: 'Non stock item',
    notes: '"PSU-PG-P-24-33V/13A "',
    saleOrganization: 'SO_1000 - MESP SALES ORG.'
  },
  {
    id: 2,
    itemName: '"S" landing door key',
    itemId: 'HMSS018',
    itemCategory: 'Schedule of rates',
    status: 'Active',
    unitOfMeasure: 'PC',
    usage: 'Stock item',
    notes: '"S" landing door key',
    saleOrganization: 'SO_1000 - MESP SALES ORG.'
  },
  {
    id: 3,
    itemName: '"TAPE-2"" MASKING TAPE TIP-210 "',
    itemId: 'XX00390',
    itemCategory: 'Others',
    status: 'Active',
    unitOfMeasure: 'EA',
    usage: 'Non stock item',
    notes: 'Tape for repair works',
    saleOrganization: 'SO_1000 - MESP SALES ORG.'
  },
  {
    id: 4,
    itemName: '"Triangle" landing door key',
    itemId: 'HMSS019',
    itemCategory: 'Schedule of rates',
    status: 'Active',
    unitOfMeasure: 'PC',
    usage: 'Stock item',
    notes: 'Triangle lock key',
    saleOrganization: 'SO_1000 - MESP SALES ORG.'
  },
  {
    id: 5,
    itemName: '"VACUUM BAG - Electrolux" Model "',
    itemId: 'XX00489',
    itemCategory: 'Others',
    status: 'Active',
    unitOfMeasure: 'EA',
    usage: 'Stock item',
    notes: 'Consumable',
    saleOrganization: 'SO_1000 - MESP SALES ORG.'
  },
  {
    id: 6,
    itemName: '"VVVF Inverter Unit (17th',
    itemId: 'XX00501',
    itemCategory: 'Schedule of rates',
    status: 'Active',
    unitOfMeasure: 'EA',
    usage: 'Stock item',
    notes: 'Spare part',
    saleOrganization: 'SO_1000 - MESP SALES ORG.'
  }
];

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[130px_1fr] gap-4 text-sm leading-8 ">
    <span className="text-[#5f6b78]">{label}</span>
    <span className="text-[#101828]">{value}</span>
  </div>
);

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return itemsData.filter(
      (item) => item.itemName.toLowerCase().includes(keyword) || item.itemId.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f5f7] text-[#0f172a]">
      <aside className="w-64 shrink-0 bg-[#001a3a] text-white">
        <div className="flex h-14 items-center gap-3 border-b border-[#16365d] px-4">
          <div className="text-4xl font-bold">K</div>
          <p className="text-3xl font-semibold">Kegmil</p>
        </div>
        <nav className="py-4">
          {navSections.map((section) => {
            const isItemCatalog = section === 'Item Catalog';
            return (
              <div key={section} className="mb-1">
                <div className="px-4 py-2 text-base text-[#b7c4d8]">{section}</div>
                {isItemCatalog && (
                  <div>
                    <div className="px-9 py-3 text-[15px] text-[#aeb7c4]">Item Category</div>
                    <div className="bg-[#0f57c5] px-9 py-3 text-[15px] font-medium text-white">Items</div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-[#dce2ea] bg-white px-6">
          <h1 className="text-4xl font-semibold">Items</h1>
          <div className="text-[15px] text-[#344054]">Suzi Tan</div>
        </header>

        <div className="p-6">
          <div className="rounded-sm border border-[#e5e7eb] bg-white p-4">
            <div className="mb-4 flex items-center gap-3">
              <button className="rounded border border-[#cfd4dc] px-4 py-2 text-sm text-[#475467]">⚲</button>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Item Name, ..."
                className="h-11 w-[340px] rounded border border-[#cfd4dc] px-4 text-sm outline-none"
              />
              <button className="h-11 rounded border border-[#cfd4dc] px-6 text-sm text-[#344054]">Status ▾</button>
            </div>

            <div className="overflow-auto border border-[#e6e9ee]">
              <table className="w-full min-w-[1200px] border-collapse bg-white text-left">
                <thead>
                  <tr className="border-b border-[#e6e9ee] bg-[#f8fafc] text-sm text-[#111827]">
                    <th className="px-5 py-4 font-semibold">ITEM NAME</th>
                    <th className="px-5 py-4 font-semibold">ITEM ID</th>
                    <th className="px-5 py-4 font-semibold">ITEM CATEGORY</th>
                    <th className="px-5 py-4 font-semibold">STATUS</th>
                    <th className="px-5 py-4 font-semibold">UNIT OF MEASURE</th>
                    <th className="px-5 py-4 font-semibold">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-[#edf0f4] text-base text-[#344054]">
                      <td className="px-5 py-4 align-top">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="text-left font-semibold text-[#0759cf] hover:underline"
                        >
                          {item.itemName}
                        </button>
                      </td>
                      <td className="px-5 py-4">{item.itemId}</td>
                      <td className="px-5 py-4">{item.itemCategory}</td>
                      <td className="px-5 py-4">{item.status}</td>
                      <td className="px-5 py-4">{item.unitOfMeasure}</td>
                      <td className="px-5 py-4">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 px-2 pt-4 text-[15px] text-[#475467]">
              <span>1-10 of 7067 items</span>
              <button className="rounded border border-[#d0d5dd] px-3 py-1 text-[#98a2b3]">‹</button>
              <button className="rounded bg-[#0f57c5] px-3 py-1 text-white">1</button>
              <button className="rounded border border-[#d0d5dd] px-3 py-1">2</button>
              <button className="rounded border border-[#d0d5dd] px-3 py-1">3</button>
            </div>
          </div>
        </div>
      </main>

      {selectedItem && (
        <>
          <div className="fixed inset-0 bg-black/35" onClick={() => setSelectedItem(null)} />
          <section className="fixed right-0 top-0 z-10 h-full w-[52vw] min-w-[760px] overflow-y-auto bg-white shadow-2xl">
            <div className="flex h-14 items-center gap-4 border-b border-[#e4e7ec] px-6 text-2xl">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-[#98a2b3]"
              >
                ✕
              </button>
              <h2 className="font-medium text-[#101828]">{selectedItem.itemName}</h2>
            </div>

            <div className="space-y-8 p-6 text-base">
              <div>
                <h3 className="mb-4 border-b border-[#eaecf0] pb-2 text-3xl font-semibold">General Information</h3>
                <div className="grid grid-cols-2 gap-5">
                  <InfoRow label="Item Name" value={selectedItem.itemName} />
                  <InfoRow label="Status" value={selectedItem.status} />
                  <InfoRow label="Item ID" value={selectedItem.itemId} />
                  <InfoRow label="External ID" value="--" />
                  <InfoRow label="Item Category" value={selectedItem.itemCategory} />
                  <InfoRow label="Created On" value="--" />
                  <InfoRow label="Usage" value={selectedItem.usage} />
                  <InfoRow label="Modified On" value="--" />
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b border-[#eaecf0] pb-2 text-3xl font-semibold">Inventory Details</h3>
                <InfoRow label="Unit of Measure" value={selectedItem.unitOfMeasure} />
              </div>

              <div>
                <h3 className="mb-4 border-b border-[#eaecf0] pb-2 text-3xl font-semibold">Organization Information</h3>
                <div className="grid grid-cols-2 gap-5">
                  <InfoRow label="Division" value="--" />
                  <InfoRow label="Sale Organization" value={selectedItem.saleOrganization} />
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b border-[#eaecf0] pb-2 text-3xl font-semibold">Additional Information</h3>
                <div className="space-y-4">
                  <InfoRow label="Attachments" value="" />
                  <InfoRow label="Notes" value={selectedItem.notes} />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
