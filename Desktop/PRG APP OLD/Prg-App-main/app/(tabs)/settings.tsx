import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useFormulas } from '../../contexts/FormulaContext';

const availableFormulas = [
  {
    id: 'lander',
    name: 'Lander',
    description: 'Widely used in scientific research',
  },
  {
    id: 'oconner',
    name: 'O\'Conner',
    description: 'Simple linear formula for quick estimates',
  },
  {
    id: 'lombardi',
    name: 'Lombardi',
    description: 'Uses exponential calculations',
  },
  {
    id: 'mayhem',
    name: 'Mayhem',
    description: 'Tends to give slightly higher estimates',
  },
  {
    id: 'wathen',
    name: 'Wathen',
    description: 'Accurate across different strength levels',
  },
  {
    id: 'brzycki',
    name: 'Brzycki',
    description: 'Popular in strength training',
  },
  {
    id: 'epley',
    name: 'Epley',
    description: 'Most commonly used formula',
  },
];

export default function Settings() {
  const { selectedFormulas, setSelectedFormulas } = useFormulas();

  const toggleFormula = (formulaId: string) => {
    setSelectedFormulas(current => {
      if (current.includes(formulaId)) {
        if (current.length === 1) return current;
        return current.filter(id => id !== formulaId);
      }
      return [...current, formulaId];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>
        
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <Text style={styles.subtitle}>Active Formulas</Text>
          <Text style={styles.description}>
            Select which formulas you want to use in the calculator.
          </Text>
          
          <View style={styles.formulaList}>
            {availableFormulas.map((formula, index) => (
              <Pressable
                key={formula.id}
                style={[
                  styles.formulaItem,
                  index < availableFormulas.length - 1 && styles.formulaItemBorder
                ]}
                onPress={() => toggleFormula(formula.id)}>
                <View style={styles.formulaInfo}>
                  <Text style={styles.formulaName}>{formula.name}</Text>
                  <Text style={styles.formulaDescription}>{formula.description}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedFormulas.includes(formula.id) && styles.checkboxSelected
                ]}>
                  {selectedFormulas.includes(formula.id) && (
                    <Check size={16} color="#1a1a1a" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DBFF00',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DBFF00',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.8,
  },
  formulaList: {
    gap: 2,
  },
  formulaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
  },
  formulaItemBorder: {
    marginBottom: 8,
  },
  formulaInfo: {
    flex: 1,
    marginRight: 12,
  },
  formulaName: {
    color: '#DBFF00',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  formulaDescription: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DBFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#DBFF00',
  },
});