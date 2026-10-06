import { motion as Motion } from "motion/react";
import StatsStar from "../components/StatsStar";
import { statPresentation } from "../data/presentation";
export default function Stats({ stats }) {
  return (
    <section>
      <header className="page-heading">
        <span className="eyebrow">SOCIAL STAT PROFILE</span>
        <h1>
          Social
          <br />
          <span className="cutout gold">stats.</span>
        </h1>
        <p>
          Activities award XP. Every 100 XP raises a stat by one rank, up to
          Rank 5.
        </p>
      </header>
      <div className="stats-layout">
        <div className="star-panel">
          <span className="eyebrow">SOCIAL STATS / CAPABILITY PROFILE</span>
          <StatsStar stats={stats} />
          <span className="star-caption">RANK 1–5 / 100 XP PER RANK</span>
        </div>
        <div className="stat-list">
          {Object.entries(stats).map(([key, stat], index) => {
            const { Icon, label, ranks } = statPresentation[key];
            return (
              <Motion.article
                className="stat-row"
                key={key}
                initial={{ x: 25, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.07 }}
              >
                <Icon />
                <div className="stat-row-content">
                  <div>
                    <h2>{label}</h2>
                    <span className="rank-badge">
                      {stat.rank}
                      <small>/5</small>
                    </span>
                  </div>
                  <p>{ranks[stat.rank - 1]}</p>
                  <div className="xp-track">
                    <Motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.rank === 5 ? 100 : stat.xp}%` }}
                      transition={{ duration: 0.7, delay: index * 0.07 }}
                    />
                  </div>
                  <span className="xp-caption">
                    {stat.rank === 5
                      ? "MAX RANK"
                      : `${stat.xp} / 100 XP TO NEXT RANK`}
                  </span>
                </div>
              </Motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
