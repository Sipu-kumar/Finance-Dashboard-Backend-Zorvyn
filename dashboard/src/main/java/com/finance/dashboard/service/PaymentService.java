package com.finance.dashboard.service;

import com.finance.dashboard.model.Payment;
import com.finance.dashboard.model.PaymentStatus;
import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.PaymentRepository;
import com.finance.dashboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;

    public PaymentService(PaymentRepository paymentRepo, UserRepository userRepo) {
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
    }

    /** Get all payments for a user */
    public List<Payment> getAllPayments(String email) {
        return paymentRepo.findByUserEmailOrderByDateDesc(email);
    }

    /** Get payments by status */
    public List<Payment> getPaymentsByStatus(String email, PaymentStatus status) {
        return paymentRepo.findByUserEmailAndStatusOrderByDateDesc(email, status);
    }

    /** Get upcoming scheduled payments */
    public List<Payment> getScheduledPayments(String email) {
        return paymentRepo.findScheduledByUser(email);
    }

    /** Get payment summary stats */
    public Map<String, Object> getPaymentStats(String email) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPaid", paymentRepo.getTotalPaidByUser(email));
        stats.put("pendingCount", paymentRepo.countPendingByUser(email));
        stats.put("totalPayments", paymentRepo.findByUserEmailOrderByDateDesc(email).size());
        return stats;
    }

    /** Create a new payment */
    public Payment createPayment(Payment payment, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        payment.setUser(user);

        // Generate a reference ID
        if (payment.getReferenceId() == null || payment.getReferenceId().isBlank()) {
            payment.setReferenceId("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Set date if not provided
        if (payment.getDate() == null) {
            payment.setDate(LocalDate.now());
        }

        // If scheduled, set status accordingly
        if (payment.getScheduledDate() != null && payment.getScheduledDate().isAfter(LocalDate.now())) {
            payment.setStatus(PaymentStatus.SCHEDULED);
        } else if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.COMPLETED);
        }

        return paymentRepo.save(payment);
    }

    /** Delete a payment */
    public void deletePayment(Long id) {
        paymentRepo.deleteById(id);
    }

    /** Mark a payment as completed */
    public Payment markAsCompleted(Long id) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setDate(LocalDate.now());
        return paymentRepo.save(payment);
    }
}
