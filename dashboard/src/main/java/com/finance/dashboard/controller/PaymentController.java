package com.finance.dashboard.controller;

import com.finance.dashboard.model.Payment;
import com.finance.dashboard.model.PaymentStatus;
import com.finance.dashboard.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    /** Get all payments for the current user */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @GetMapping
    public List<Payment> getAll(Authentication auth,
                                @RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return service.getPaymentsByStatus(auth.getName(), PaymentStatus.valueOf(status));
        }
        return service.getAllPayments(auth.getName());
    }

    /** Get scheduled/upcoming payments */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @GetMapping("/scheduled")
    public List<Payment> getScheduled(Authentication auth) {
        return service.getScheduledPayments(auth.getName());
    }

    /** Get payment stats */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    @GetMapping("/stats")
    public Map<String, Object> getStats(Authentication auth) {
        return service.getPaymentStats(auth.getName());
    }

    /** Create a new payment (ADMIN / ANALYST only) */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Payment create(@RequestBody Payment payment, Authentication auth) {
        return service.createPayment(payment, auth.getName());
    }

    /** Mark a scheduled payment as completed */
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    @PatchMapping("/{id}/complete")
    public Payment markComplete(@PathVariable Long id) {
        return service.markAsCompleted(id);
    }

    /** Delete a payment (ADMIN only) */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deletePayment(id);
    }
}
