export class AIMatchingService {
  static calculateCompatibilityScore(participant, criteria) {
    let score = 0
    let totalWeight = 0

    // Demographics matching
    if (criteria.demographics) {
      const demographicScore = this.matchDemographics(participant, criteria.demographics)
      score += demographicScore * 0.3
      totalWeight += 0.3
    }

    // Lifestyle matching
    if (criteria.lifestyle) {
      const lifestyleScore = this.matchLifestyle(participant, criteria.lifestyle)
      score += lifestyleScore * 0.25
      totalWeight += 0.25
    }

    // Media preferences matching
    if (criteria.mediaPreferences) {
      const mediaScore = this.matchMediaPreferences(participant, criteria.mediaPreferences)
      score += mediaScore * 0.25
      totalWeight += 0.25
    }

    // Behavioral traits matching
    if (criteria.behavioralTraits) {
      const behaviorScore = this.matchBehavioralTraits(participant, criteria.behavioralTraits)
      score += behaviorScore * 0.2
      totalWeight += 0.2
    }

    return totalWeight > 0 ? score / totalWeight : 0
  }

  static matchDemographics(participant, criteria) {
    let score = 0
    let factors = 0

    if (criteria.ageRange) {
      const age = participant.age
      if (age >= criteria.ageRange.min && age <= criteria.ageRange.max) {
        score += 1
      }
      factors++
    }

    if (criteria.gender && criteria.gender.length > 0) {
      if (criteria.gender.includes(participant.gender)) {
        score += 1
      }
      factors++
    }

    if (criteria.location && criteria.location.length > 0) {
      if (criteria.location.includes(participant.location_country) || 
          criteria.location.includes(participant.location_state)) {
        score += 1
      }
      factors++
    }

    if (criteria.income && criteria.income.length > 0) {
      if (criteria.income.includes(participant.income)) {
        score += 1
      }
      factors++
    }

    return factors > 0 ? score / factors : 1
  }

  static matchLifestyle(participant, criteria) {
    let score = 0
    let factors = 0

    if (criteria.hobbies && criteria.hobbies.length > 0) {
      const participantHobbies = participant.hobbies || []
      const overlap = criteria.hobbies.filter(hobby => participantHobbies.includes(hobby))
      score += overlap.length / criteria.hobbies.length
      factors++
    }

    if (criteria.techAdoption && criteria.techAdoption.length > 0) {
      if (criteria.techAdoption.includes(participant.tech_adoption)) {
        score += 1
      }
      factors++
    }

    return factors > 0 ? score / factors : 1
  }

  static matchMediaPreferences(participant, criteria) {
    let score = 0
    let factors = 0

    if (criteria.genres && criteria.genres.length > 0) {
      const participantGenres = participant.favorite_genres || []
      const overlap = criteria.genres.filter(genre => participantGenres.includes(genre))
      score += overlap.length / criteria.genres.length
      factors++
    }

    if (criteria.devices && criteria.devices.length > 0) {
      const participantDevices = participant.device_preference || []
      const overlap = criteria.devices.filter(device => participantDevices.includes(device))
      score += overlap.length / criteria.devices.length
      factors++
    }

    return factors > 0 ? score / factors : 1
  }

  static matchBehavioralTraits(participant, criteria) {
    let score = 0
    let factors = 0

    if (criteria.personalityType && criteria.personalityType.length > 0) {
      if (criteria.personalityType.includes(participant.personality_type)) {
        score += 1
      }
      factors++
    }

    if (criteria.decisionMaking && criteria.decisionMaking.length > 0) {
      if (criteria.decisionMaking.includes(participant.decision_making)) {
        score += 1
      }
      factors++
    }

    return factors > 0 ? score / factors : 1
  }

  static async findBestMatches(participants, criteria, targetCount = 10) {
    const scoredParticipants = participants.map(participant => ({
      ...participant,
      compatibilityScore: this.calculateCompatibilityScore(participant, criteria)
    }))

    // Sort by compatibility score (highest first)
    scoredParticipants.sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    // Return top matches
    return scoredParticipants.slice(0, targetCount)
  }

  static generateMatchingInsights(selectedParticipants, criteria) {
    const insights = {
      averageCompatibility: 0,
      strongMatches: 0,
      demographicBreakdown: {},
      recommendations: []
    }

    if (selectedParticipants.length === 0) return insights

    // Calculate average compatibility
    const totalScore = selectedParticipants.reduce((sum, p) => sum + (p.compatibilityScore || 0), 0)
    insights.averageCompatibility = totalScore / selectedParticipants.length

    // Count strong matches (score > 0.8)
    insights.strongMatches = selectedParticipants.filter(p => (p.compatibilityScore || 0) > 0.8).length

    // Generate demographic breakdown
    selectedParticipants.forEach(participant => {
      // Age groups
      const ageGroup = this.getAgeGroup(participant.age)
      insights.demographicBreakdown[ageGroup] = (insights.demographicBreakdown[ageGroup] || 0) + 1
    })

    // Generate recommendations
    if (insights.averageCompatibility < 0.6) {
      insights.recommendations.push('Consider broadening your target criteria to find better matches')
    }
    if (insights.strongMatches < selectedParticipants.length * 0.5) {
      insights.recommendations.push('You may want to adjust your demographic filters for better alignment')
    }

    return insights
  }

  static getAgeGroup(age) {
    if (age < 25) return '18-24'
    if (age < 35) return '25-34'
    if (age < 45) return '35-44'
    if (age < 55) return '45-54'
    if (age < 65) return '55-64'
    return '65+'
  }
}