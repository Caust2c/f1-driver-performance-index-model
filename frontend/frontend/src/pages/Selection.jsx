import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Selection.css";

const f1Teams = [
  { id: "ferrari", name: "Ferrari", color: "#E8002D", logo: "/assets/logos/ferrari.jpg", drivers: [{ name: "Leclerc", num: 16, img: "/assets/drivers/leclerc.jpg" }, { name: "Hamilton", num: 44, img: "/assets/drivers/hamilton.jpg" }] },
  { id: "mclaren", name: "McLaren", color: "#FF8000", logo: "/assets/logos/mclaren.jpg", drivers: [{ name: "Norris", num: 4, img: "/assets/drivers/landonorris.jpg" }, { name: "Piastri", num: 81, img: "/assets/drivers/oscarpiastri.jpg" }] },
  { id: "redbull", name: "Red Bull", color: "#3671C6", logo: "/assets/logos/redbull.jpg", drivers: [{ name: "Verstappen", num: 1, img: "/assets/drivers/maxverstappen.jpg" }, { name: "Perez", num: 11, img: "/assets/drivers/sergioperez.jpg" }] },
  { id: "mercedes", name: "Mercedes", color: "#27F4D2", logo: "/assets/logos/mercedes.jpg", drivers: [{ name: "Russell", num: 63, img: "/assets/drivers/georgerussell.jpg" }, { name: "Antonelli", num: 12, img: "/assets/drivers/kimiantonelli.jpg" }] },
  { id: "aston", name: "Aston Martin", color: "#229971", logo: "/assets/logos/astonmartin.jpg", drivers: [{ name: "Alonso", num: 14, img: "/assets/drivers/fernandoalonso.jpg" }, { name: "Stroll", num: 18, img: "/assets/drivers/lancestroll.jpg" }] },
  { id: "alpine", name: "Alpine", color: "#FF87BC", logo: "/assets/logos/alpine.jpg", drivers: [{ name: "Gasly", num: 10, img: "/assets/drivers/pierregasly.jpg" }, { name: "Doohan", num: 7, img: "/assets/drivers/jackdoohan.jpg" }] },
  { id: "williams", name: "Williams", color: "#64C4FF", logo: "/assets/logos/williams.jpg", drivers: [{ name: "Albon", num: 23, img: "/assets/drivers/alexalbon.jpg" }, { name: "Sainz", num: 55, img: "/assets/drivers/carlossainz.jpg" }] },
  { id: "haas", name: "Haas", color: "#FFFFFF", logo: "/assets/logos/haas.jpg", drivers: [{ name: "Ocon", num: 31, img: "/assets/drivers/estebanocon.jpg" }, { name: "Bearman", num: 87, img: "/assets/drivers/olliebearman.jpg" }] },
  { id: "vcarb", name: "VCARB", color: "#6692FF", logo: "/assets/logos/vcarb.jpg", drivers: [{ name: "Tsunoda", num: 22, img: "/assets/drivers/yukitsunoda.jpg" }, { name: "Hadjar", num: 6, img: "/assets/drivers/isackhadjar.jpg" }] },
  { id: "sauber", name: "Kick Sauber", color: "#00E701", logo: "/assets/logos/kicksauber.jpg", drivers: [{ name: "Hulkenberg", num: 27, img: "/assets/drivers/nicohulkenberg.jpg" }, { name: "Bortoleto", num: 5, img: "/assets/drivers/gabrielbortoleto.jpg" }] }
];

export default function Selection({ selectedDrivers = [], setSelectedDrivers }) {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);

  const toggleDriver = (driverName) => {
    setSelectedDrivers((prev = []) =>
      prev.includes(driverName)
        ? prev.filter((d) => d !== driverName)
        : [...prev, driverName]
    );
  };

  const toggleTeam = (teamDrivers) => {
    const driverNames = teamDrivers.map(d => d.name);
    const bothSelected = driverNames.every((d) => selectedDrivers.includes(d));
    if (bothSelected) {
      setSelectedDrivers((prev = []) => prev.filter((d) => !driverNames.includes(d)));
    } else {
      setSelectedDrivers((prev = []) => {
        const newSet = new Set([...prev, ...driverNames]);
        return Array.from(newSet);
      });
    }
  };

  const selectAll = () => {
    const allDrivers = f1Teams.flatMap((team) => team.drivers.map(d => d.name));
    setSelectedDrivers(allDrivers);
  };

  const clearAll = () => setSelectedDrivers([]);

  return (
    <div className="selection-minimal">

      <header className="minimal-header">
        <div className="header-left">
          <h2>VELOCITY<span>STATS</span></h2>
        </div>
        <div className="header-center">
          <span className="count-display">
            <span className="count-number">{(selectedDrivers || []).length}</span> / 20
          </span>
        </div>
        <div className="header-right">
          <button className="minimal-text-btn" onClick={selectAll}>ALL</button>
          <span className="divider">|</span>
          <button className="minimal-text-btn" onClick={clearAll}>CLEAR</button>
        </div>
      </header>

      <main className="minimal-grid">
        {f1Teams.map((team) => {
          const safeDrivers = selectedDrivers || [];
          const bothSelected = team.drivers.every((d) => safeDrivers.includes(d.name));

          return (
            <div key={team.id} className="minimal-team-group" style={{ "--team-color": team.color }}>
              
              <div 
                className="team-group-header"
                onClick={() => toggleTeam(team.drivers)}
              >
                <div className="team-title-wrap">
                  <img 
                    src={team.logo} 
                    alt={team.name} 
                    className="minimal-team-logo" 
                  />
                  <h3 className="team-name">{team.name.toUpperCase()}</h3>
                </div>
                <button className={`team-quick-toggle ${bothSelected ? "active" : ""}`}>
                  {bothSelected ? "−" : "+"}
                </button>
              </div>

              <div className="driver-cards-container">
                {team.drivers.map((driver) => {
                  const isSelected = safeDrivers.includes(driver.name);
                  return (
                    <div
                      key={driver.name}
                      className={`driver-card ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleDriver(driver.name)}
                    >
                      <div className="driver-card-left">
                        <img 
                          src={driver.img} 
                          alt={driver.name} 
                          className="driver-card-pic" 
                        />
                        <span className="driver-card-name">{driver.name.toUpperCase()}</span>
                      </div>
                      <span className="driver-card-number">{driver.num}</span>
                      <div className="card-accent-line"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      <footer className="minimal-footer">
        <button 
          className="minimal-launch-btn" 
          onClick={() => {
            setTimeout(() => navigate("/home"), 100);
          }}
          disabled={!selectedDrivers || selectedDrivers.length === 0}
        >
          INITIATE TELEMETRY
        </button>
      </footer>
    </div>
  );
}