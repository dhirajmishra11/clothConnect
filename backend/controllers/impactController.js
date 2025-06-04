const Donation = require("../models/Donation");
const User = require("../models/User");

exports.getUserImpact = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id });
    
    // Calculate monthly donations (last 6 months)
    const monthlyStats = new Array(6).fill(0);
    donations.forEach(donation => {
      const month = new Date(donation.createdAt).getMonth();
      if (month >= 0 && month < 6) {
        monthlyStats[month] += donation.quantity || 0;
      }
    });

    const monthlyDonations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, index) => ({
      label,
      value: monthlyStats[index]
    }));

    // Calculate total impact
    const totalClothes = donations.reduce((sum, donation) => sum + (donation.quantity || 0), 0);
    
    // Calculate environmental impact
    // Assumptions:
    // - Each clothing item saves 2kg CO2
    // - Each clothing item saves 2000L water
    // - Each clothing item saves 3.6 kWh energy
    // - Each clothing item saves 0.1m³ landfill space
    const co2Saved = totalClothes * 2;
    const waterSaved = totalClothes * 2000;
    const energySaved = totalClothes * 3.6;
    const landfillSaved = totalClothes * 0.1;
    
    // Estimate beneficiaries (assume average 5 items per beneficiary)
    const beneficiaries = Math.round(totalClothes / 5);
    
    // Calculate recycling rate (assume 85% success rate)
    const recyclingRate = 85;

    const response = {
      monthlyDonations,
      totalImpact: {
        clothes: totalClothes,
        beneficiaries,
        co2Saved,
        recyclingRate,
        waterSaved,
        energySaved,
        landfillSaved
      },
      achievements: [
        {
          icon: '🌟',
          label: 'Top Donor',
          unlocked: totalClothes >= 100
        },
        {
          icon: '🎯',
          label: '50 Items',
          unlocked: totalClothes >= 50
        },
        {
          icon: '🌱',
          label: 'Eco Warrior',
          unlocked: co2Saved >= 100
        },
        {
          icon: '🤝',
          label: 'Community Hero',
          unlocked: beneficiaries >= 20
        },
        {
          icon: '🌍',
          label: 'Global Impact',
          unlocked: co2Saved >= 500
        },
        {
          icon: '⭐',
          label: 'Super Donor',
          unlocked: totalClothes >= 200
        }
      ]
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching impact data" });
  }
};