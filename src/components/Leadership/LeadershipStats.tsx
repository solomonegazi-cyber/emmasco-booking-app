import React from "react";

const LeadershipStats = () => {

    const stats = [

        {
            number: "15+",
            title: "Years Experience"
        },

        {
            number: "500+",
            title: "Happy Families"
        },

        {
            number: "98%",
            title: "Client Satisfaction"
        },

        {
            number: "24/7",
            title: "Customer Support"
        }

    ];

    return (

        <div className="leadership-stats">

            {stats.map((item, index) => (

                <div
                    key={index}
                    className="stat-card"
                >

                    <h2>{item.number}</h2>

                    <p>{item.title}</p>

                </div>

            ))}

        </div>

    );

};

export default LeadershipStats;